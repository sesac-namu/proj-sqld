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
        headless=False,
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
        await asyncio.sleep(3)
        await page.locator('#mock-exam-button').click()

        # 문제지 고유 번호 추출
        await page.wait_for_selector('#content-container > div.question-content')
        match = re.search(r'/mock-exam/(\d+)/', page.url)
        if match:
            page_id = match.group(1)
            
        current_url = f'https://www.sqld.kr/mock-exam/{page_id}/question/{idx}?is_review=True'
        return current_url

    except Exception as e:
        print(f"[{idx}] 에러 발생: {e}")
    finally:
        
        await context.close()
        await browser.close()

async def main():
    urls = ["https://www.sqld.kr/"] * 3
    
    # urls = urls[-1:]
    # print(urls)
    urls = split_url(urls, 3)
    
    
    results = []
    async with async_playwright() as playwright:
        for url_list in tqdm(urls, total=len(urls)):
            tasks = [fetch_table(playwright, idx, url) for idx, url in enumerate(url_list)]
            batch_results = await asyncio.gather(*tasks)
            results.append(batch_results)

    print(results)

asyncio.run(main())
