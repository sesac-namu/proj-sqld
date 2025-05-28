import asyncio
from playwright.async_api import async_playwright
import pandas as pd
import random
from itertools import chain
from tqdm import tqdm
import re

# 리스트 나누기
def split_url(urls, split_num):
    new_urls = []   
    for i in range(0, len(urls), split_num):
        new_urls.append(urls[i: i+split_num])

    return new_urls

async def fetch_table(playwright, idx, url):
    # url, p_index = arg
    browser = await playwright.chromium.launch(
        headless=True,
        args= ['--disable-blink-features=AutomationControlled']
        )
    context = await browser.new_context()
    page = await context.new_page()

    # print(url)
    try:
        # print(f"[{idx}] 접속 중: {url}")
        await page.goto(url, wait_until='domcontentloaded')

        await page.locator('body > div.login-container > button').click()
        


        # ✅ 비밀번호 필드가 나타날 때까지 기다림
        await page.wait_for_selector('#identifierId', timeout=10000)
        await page.locator('#identifierId').fill('remember33330')
        await page.locator('#identifierNext > div > button > div.VfPpkd-RLmnJb').click()
        
        # await asyncio.sleep(5)

        # ✅ 비밀번호 필드가 나타날 때까지 기다림
        await page.wait_for_selector('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input', timeout=10000)
        await page.locator('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input').fill('tmddlf795')
        await page.locator('#passwordNext > div > button > div.VfPpkd-RLmnJb').click()

        # 모의 고사 버튼
        await page.wait_for_selector('#mock-exam-button')
        await page.locator('#mock-exam-button').click()

        await page.wait_for_selector('#content-container > div.question-content')
        match = re.search(r'/mock-exam/(\d+)/', page.url)
        if match:
            page_id = match.group(1)
            
        datas = []
        for idx in range(50):
            try:
                current_url = f'https://www.sqld.kr/mock-exam/{page_id}/question/{idx}?is_review=True'
                await page.goto(current_url, wait_until='networkidle')

                # 태그 생길때 까지 기다리기
                await page.wait_for_selector('#content-container > div.question-content')
            except:
                current_url = f'https://www.sqld.kr/mock-exam/{page_id}/question/{idx}?is_review=True'
                await page.goto(current_url, wait_until='networkidle')

            # 문제 제목
            question_title = await page.locator('#content-container > div.question-content').inner_text()
            question_title = question_title.replace('[문제]', '').strip()

            # 지문
            text_part = None
            text_locator = page.locator('#psg-section > div:nth-child(2)')
            text_count = await text_locator.count()
            if text_count > 0:
                txt = await text_locator.inner_text()
                if txt.strip():
                    text_part = txt.strip()

            # 지문의 사진
            image_url = None
            image_locator = page.locator('#psg-section > img')
            image_count = await image_locator.count()

            if image_count > 0:
                src = await image_locator.nth(0).get_attribute('src')
                if src:
                    image_url = src

            # 보기
            choices_locator = page.locator('#options-container > form > div > label')
            choices_count = await choices_locator.count()
            choices = []

            for i in range(choices_count):
                choice_text = await choices_locator.nth(i).inner_text()
                choice_text = choice_text.replace('\t', '').replace('\n', '')[1:]
                choices.append(choice_text)

            # 정답
            answer1 = await page.locator('#options-container > form > div.mt-4.text-center > div > div:nth-child(2)').inner_text()
            answer2 = await page.locator('#options-container > form > div.mt-4.text-center > div > div:nth-child(3)').inner_text()
            answer = '\n'.join([answer1.strip(), answer2.strip()])

            # print(question_title, text_part, choices, answer)
            data = {
                'id': idx+1,
                'title': question_title,
                'content_img': image_url,
                'content_text': text_part,
                'choices_1': choices[0],
                'choices_2': choices[1],
                'choices_3': choices[2],
                'choices_4': choices[3],
                'answer': answer
            }
            datas.append(data)

            await asyncio.sleep(.5)

        await asyncio.sleep(random.randint(3, 7))
        return datas

    except Exception as e:
        print(f"[{idx}] 에러 발생: {e}")
    finally:
        
        await context.close()
        await browser.close()

async def main():
    urls = ["https://www.sqld.kr/"] * 1000
    
    # urls = urls[-1:]
    # print(urls)
    urls = split_url(urls, 2)
    
    page_index = range(8000, 6000)
    
    results = []
    async with async_playwright() as playwright:
        for url_list in tqdm(urls, total=len(urls)):
            tasks = [fetch_table(playwright, idx, url) for idx, url in enumerate(url_list)]
            batch_results = await asyncio.gather(*tasks)
            results.extend(batch_results)

    # results는 리스트 안에 리스트가 있으니 평탄화
    flat_results = list(chain.from_iterable(results))
    df = pd.DataFrame(flat_results)
    df.to_csv('data/sqld_kr_data.csv', encoding='utf-8', index=False)

asyncio.run(main())
