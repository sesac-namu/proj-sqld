import asyncio
from playwright.async_api import async_playwright
import pandas as pd
import random
from itertools import chain
from tqdm import tqdm
import re

async def login_and_get_page_id(page):
    """로그인하고 문제지 ID를 얻는 함수"""
    try:
        # 홈페이지로 이동
        await page.goto("https://www.sqld.kr/", wait_until='domcontentloaded')
        
        # 로그인 버튼 클릭
        await page.locator('body > div.login-container > button').click()
        
        # 구글 로그인 - 이메일 입력
        await page.wait_for_selector('#identifierId', timeout=10000)
        await page.locator('#identifierId').fill('remember33330')
        await page.locator('#identifierNext > div > button > div.VfPpkd-RLmnJb').click()
        
        # 비밀번호 입력
        await page.wait_for_selector('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input', timeout=10000)
        await page.locator('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input').fill('tmddlf795')
        await page.locator('#passwordNext > div > button > div.VfPpkd-RLmnJb').click()

        # 모의고사 버튼 클릭
        await page.wait_for_selector('#mock-exam-button')
        await asyncio.sleep(3)
        await page.locator('#mock-exam-button').click()

        # 문제지 고유 번호 추출
        await page.wait_for_selector('#content-container > div.question-content')
        match = re.search(r'/mock-exam/(\d+)/', page.url)
        if match:
            page_id = match.group(1)
            print(f"문제지 ID: {page_id}")
            return page_id
        else:
            raise Exception("문제지 ID를 찾을 수 없습니다.")

        
            
    except Exception as e:
        print(f"로그인 중 에러 발생: {e}")
        raise

async def fetch_question_data(page, page_id, question_idx):
    """개별 문제 데이터를 가져오는 함수"""
    try:
        # 문제 URL로 이동
        url = f'https://www.sqld.kr/mock-exam/{page_id}/question/{question_idx}?is_review=True'
        await page.goto(url, wait_until='domcontentloaded')
        
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

        data = {
            'id': question_idx + 1,
            'page_id': page_id,
            'title': question_title,
            'content_img': image_url,
            'content_text': text_part,
            'choices_1': choices[0] if len(choices) > 0 else None,
            'choices_2': choices[1] if len(choices) > 1 else None,
            'choices_3': choices[2] if len(choices) > 2 else None,
            'choices_4': choices[3] if len(choices) > 3 else None,
            'answer': answer
        }

        await asyncio.sleep(0.5)  # 서버 부하 방지
        return data

    except Exception as e:
        print(f"문제 {question_idx} 수집 중 에러 발생: {e}")
        return None

async def main():
    async with async_playwright() as playwright:
        # 단일 브라우저 인스턴스 생성
        browser = await playwright.chromium.launch(
            headless=False,
            args=['--disable-blink-features=AutomationControlled']
        )
        context = await browser.new_context()
        page = await context.new_page()
        
        results = []
        # 1단계: 로그인하고 문제지 ID 획득
        print("로그인 중...")
        page_id = await login_and_get_page_id(page)
        try:
            # for _ in tqdm(range(1000), desc="문제 수집 중"):
            while True:
                # 2단계: 문제 데이터 수집
                # print("문제 데이터 수집 시작...")
                
                # 원하는 문제 번호 범위 설정 (0~49번 문제)
                question_range = range(50)  # 0부터 49까지
                
                for question_idx in question_range:
                    data = await fetch_question_data(page, page_id, question_idx)
                    if data:
                        results.append(data)
                
                await page.goto('https://www.sqld.kr/')

                # 모의고사 버튼 클릭
                await page.wait_for_selector('#mock-exam-button')
                await asyncio.sleep(3)
                await page.locator('#mock-exam-button').click()

                # 문제지 고유 번호 추출
                await page.wait_for_selector('#content-container > div.question-content')
                match = re.search(r'/mock-exam/(\d+)/', page.url)
                if match:
                    page_id = match.group(1)

        except Exception as e:
            print(f"메인 프로세스 중 에러 발생: {e}")
        finally:
            # 브라우저 종료
            await context.close()
            await browser.close()

            # 3단계: 데이터 저장
            if results:
                df = pd.DataFrame(results)
                filename = f'data/sqld_kr_data_{page_id}.csv'
                df.to_csv(filename, encoding='utf-8', index=False)
                print(f"총 {len(results)}개 문제 데이터가 {filename}에 저장되었습니다.")
            else:
                print("수집된 데이터가 없습니다.")

        
if __name__ == "__main__":
    try:
        asyncio.run(main())
    except:
        asyncio.run(main())