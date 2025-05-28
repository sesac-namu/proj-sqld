import asyncio
from playwright.async_api import async_playwright
import pandas as pd
import time
import random
from datetime import datetime, timedelta
from itertools import chain
from io import StringIO
from tabulate import tabulate

pitcher_dfs = []
batter_dfs = []

# 리스트 나누기
def split_url(urls, split_num):
    new_urls = []
    for i in range(0, len(urls), split_num):
        new_urls.append(urls[i: i+split_num])

    return new_urls

def get_table(page):
    pass

    
async def fetch_table(playwright, idx, url):
    browser = await playwright.chromium.launch(headless=True)
    context = await browser.new_context()
    page = await context.new_page()
    
    if not page.is_closed():
        print('페이지 닫힘')
        return
    await page.goto(url)
    
    questions = await page.locator('#frm > div > div > div.exam_test_container > div.exam_box > div.exam_text > div')
    for question in questions:
        print(question)
    
    
    
    await context.close()
    await browser.close()

async def main():
    urls = ["https://cbt.youngjin.com/exam/exam.php?type=%EB%AA%A8%EC%9D%98&license_no=73&subject_count=50&no=73"] * 10
    
    urls = urls[-1:]
    print(urls)
    # urls = split_url(urls, 5)
    
    results = []
    async with async_playwright() as playwright:
        for url_list in urls:
            tasks = [fetch_table(playwright, idx, url) for idx, url in enumerate(url_list)]    
            results.append(await asyncio.gather(*tasks))
        # tasks = [fetch_table(playwright, idx, url) for idx, url in enumerate(urls)]
        # results.append(await asyncio.gather(*tasks))

    # print(results)

asyncio.run(main())