import asyncio
from playwright.async_api import async_playwright
import pandas as pd
import random
from itertools import chain
from tqdm import tqdm

# 리스트 나누기
def split_url(urls, split_num):
    new_urls = []   
    for i in range(0, len(urls), split_num):
        new_urls.append(urls[i: i+split_num])

    return new_urls

async def fetch_table(playwright, idx, url):
    browser = await playwright.chromium.launch(headless=True)
    context = await browser.new_context()
    page = await context.new_page()
    
    try:
        # print(f"[{idx}] 접속 중: {url}")
        await page.goto(url, wait_until='domcontentloaded')
        # await page.wait_for_selector('#frm', timeout=10000)  # 최대 10초 대기

        questions = page.locator('#frm > div > div > div.exam_test_container > div.exam_box > div.exam_text > div')
        count = await questions.count()

        datas = []
        for i in range(count):
            # 문제 div들
            questions_div = questions.nth(i)

            # 제목
            questions_title = await questions_div.locator('p').first.inner_text()
            questions_title = questions_title.replace('\n', '')[2:]

            questions_content = questions_div.nth(3)

            # --- 이미지 추출 (존재할 경우만)
            image_url = None
            img_locator = questions_div.locator('div:nth-child(3) > img')
            img_count = await img_locator.count()

            if img_count > 0:
                src = await img_locator.nth(0).get_attribute('src')
                if src:
                    image_url = 'https://cbt.youngjin.com' + src

            # print(image_urls)

            # --- 텍스트 추출 (p, span, div 등 여러 유형 커버)
            text_part = None
            text_locator = questions_content.locator('div:nth-child(3) > p')
            text_count = await text_locator.count()

            if text_count > 0:
                txt = await text_locator.inner_text()
                if txt.strip():
                    text_part = txt.strip()
                        
            # 보기 추출 (ul > li들)
            choices_locator = questions_div.locator('ul > li')
            choices_count = await choices_locator.count()
            choices = []
            for j in range(choices_count):
                choice_text = await choices_locator.nth(j).inner_text()
                # text = str(j+1)+choice_text.replace('\t', '')
                text = choice_text.replace('\t', '').replace('\n', '')[1:]
                choices.append(text)

            answer = await questions_div.locator('div.explanation').inner_text()
            answer = answer.replace('\t', '').replace('\n','').strip()

            data = {
                'title': questions_title,
                'content_img': image_url,
                'content_text': text_part,
                'choices_1': choices[0],
                'choices_2': choices[1],
                'choices_3': choices[2],
                'choices_4': choices[3],
                'answer': answer
            }
            datas.append(data)

        return datas


    except Exception as e:
        print(f"[{idx}] 에러 발생: {e}")
    finally:
        await context.close()
        await browser.close()

async def main():
    urls = ["https://cbt.youngjin.com/exam/exam.php?type=%EB%AA%A8%EC%9D%98&license_no=73&subject_count=50&no=73"] * 50
    
    # urls = urls[-1:]
    # print(urls)
    urls = split_url(urls, 5)
    
    results = []
    async with async_playwright() as playwright:
        for url_list in tqdm(urls, total=len(urls)):
            tasks = [fetch_table(playwright, idx, url) for idx, url in enumerate(url_list)]
            batch_results = await asyncio.gather(*tasks)
            results.extend(batch_results)

            await asyncio.sleep(random.randint(3, 7))

    # print(results)
    # results는 리스트 안에 리스트가 있으니 평탄화
    flat_results = list(chain.from_iterable(results))
    df = pd.DataFrame(flat_results)
    df.to_csv('./data/E_miracle_data.csv', encoding='utf-8', index=False)

asyncio.run(main())