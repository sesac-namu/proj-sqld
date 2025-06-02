import asyncio
from playwright.async_api import async_playwright
import pandas as pd
import random
from itertools import chain
from tqdm import tqdm
import re

async def handle_popups(page):
    """다양한 방법으로 팝업을 처리하는 함수"""
    try:
        # 팝업이 나타날 때까지 잠시 대기        
        # 여러 가지 닫기 버튼 시도
        close_selectors = [
            'button:has-text("닫기")',
            'button:has-text("Close")', 
            'button:has-text("확인")',
            '[class*="close"]',
            '[aria-label="닫기"]',
            '[aria-label="Close"]',
            '.modal-close',
            '.popup-close',
            'button[onclick*="close"]',
            # 이미지에서 보이는 "닫기" 버튼
            'button:nth-child(1)',  # 첫 번째 버튼 (보통 닫기)
        ]
        
        for selector in close_selectors:
            try:
                element = page.locator(selector)
                count = await element.count()
                if count > 0:
                    await element.first.click()
                    print(f"팝업을 {selector}로 닫았습니다.")
                    await asyncio.sleep(.5)
                    return True
            except:
                continue
        
        # ESC 키로 팝업 닫기 시도
        await page.keyboard.press('Escape')
        await asyncio.sleep(.5)
        
        # 팝업 영역 밖 클릭 (백드롭 클릭)
        try:
            await page.click('body', position={'x': 10, 'y': 10})
        except:
            pass
            
        return False
        
    except Exception as e:
        print(f"팝업 처리 중 오류: {e}")
        return False

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

        await page.wait_for_selector('body > div.main-container > a.btn.btn-primary.btn-large')
        # 무한 문제 풀기 버튼 클릭
        await page.goto('https://www.sqld.kr/practice')
        # 팝업 처리 (로그인 직후에 나타날 수 있음)
        # await handle_popups(page)


            
    except Exception as e:
        print(f"로그인 중 에러 발생: {e}")
        raise

async def fetch_question_data(page):
    """개별 문제 데이터를 가져오는 함수"""
    
    try:
        # 문제 제목
        question_title = await page.locator('#q-cont').inner_text()
        question_title = question_title.strip()

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
        choices_locator = page.locator('#options-container > div > label')
        choices_count = await choices_locator.count()
        choices = []

        for i in range(choices_count):
            choice_text = await choices_locator.nth(i).inner_text()
            choice_text = choice_text.replace('\t', '').replace('\n', '')[1:]
            choices.append(choice_text)

        # 아무거나 버튼 누르고 정답 버튼 누르기
        await page.locator('#option-4').click()
        await page.wait_for_selector('#content-container > button', timeout=10000)
        await page.locator('#content-container > button').click()

        # 정답 & 해설
        await page.wait_for_selector('#explanation-container', timeout=10000)
        answer = await page.locator('#explanation-container').inner_text()

        remove_words = ["오답입니다!!", "정답입니다!!", "[정답]", "[해설]", "문제 계속 풀기"]
        cleaned_text = answer
        for word in remove_words:
            cleaned_text = cleaned_text.replace(word, '')
            # answer = '\n'.join([answer1.strip(), answer2.strip()])
        # 불필요한 공백 제거
        answer = ' '.join(cleaned_text.split())


        data = {
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

        # 다음 문제로 넘기기
        await page.reload()
        return data

    except Exception as e:
        return None

async def main():
    async with async_playwright() as playwright:
        # 단일 브라우저 인스턴스 생성
        browser = await playwright.chromium.launch(
            headless=False,
            args=['--disable-blink-features=AutomationControlled']
        )
        context = await browser.new_context(
            ignore_https_errors=True,
            java_script_enabled=True
        )
        page = await context.new_page()
        
        results = []
        # 1단계: 로그인하고 문제지 ID 획득
        print("로그인 중...")
        count = 0
        await login_and_get_page_id(page)
        try:
            c = 0
            while True:
                data = await fetch_question_data(page)
                if data:
                    results.append(data)
                if c == 10:
                    break
                c += 1

        except Exception as e:
            print(f"메인 프로세스 중 에러 발생: {e}")
        finally:
            # 브라우저 종료
            await context.close()
            await browser.close()

            # 3단계: 데이터 저장
            if results:
                count += 1
                df = pd.DataFrame(results)
                filename = f'data/sqld_kr_data_infinity_{count}.csv'
                df.to_csv(filename, encoding='utf-8', index=False)
                print(f"총 {len(results)}개 문제 데이터가 {filename}에 저장되었습니다.")
            else:
                print("수집된 데이터가 없습니다.")

        
if __name__ == "__main__":
    asyncio.run(main())