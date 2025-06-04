import asyncio
from playwright.async_api import async_playwright
import pandas as pd
import random
from itertools import chain
from tqdm import tqdm
import re
import os
import time
from datetime import datetime

class SQLDCrawler:
    def __init__(self):
        self.results = []
        self.total_collected = 0
        self.session_count = 0
        self.start_time = time.time()
        
    async def login_and_get_page_id(self, page):
        """로그인하고 문제지 ID를 얻는 함수"""
        try:
            print("🔐 로그인 시작...")
            # 홈페이지로 이동
            await page.goto("https://www.sqld.kr/", wait_until='domcontentloaded', timeout=30000)
            
            # 로그인 버튼 클릭
            await page.locator('body > div.login-container > button').click()
            
            # 구글 로그인 - 이메일 입력
            await page.wait_for_selector('#identifierId', timeout=15000)
            await page.locator('#identifierId').fill('remember33330')
            await page.locator('#identifierNext > div > button > div.VfPpkd-RLmnJb').click()
            
            # 비밀번호 입력
            await page.wait_for_selector('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input', timeout=15000)
            await page.locator('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input').fill('tmddlf795')
            await page.locator('#passwordNext > div > button > div.VfPpkd-RLmnJb').click()

            # 모의고사 버튼 클릭
            await page.wait_for_selector('#mock-exam-button', timeout=20000)
            await asyncio.sleep(3)
            await page.locator('#mock-exam-button').click()

            # 문제지 고유 번호 추출
            await page.wait_for_selector('#content-container > div.question-content', timeout=20000)
            match = re.search(r'/mock-exam/(\d+)/', page.url)
            if match:
                page_id = match.group(1)
                print(f"✅ 문제지 ID: {page_id}")
                return page_id
            else:
                raise Exception("문제지 ID를 찾을 수 없습니다.")
                
        except Exception as e:
            print(f"❌ 로그인 중 에러 발생: {e}")
            raise

    async def fetch_question_data(self, page, page_id, question_idx):
        """개별 문제 데이터를 가져오는 함수"""
        try:
            # 문제 URL로 이동
            url = f'https://www.sqld.kr/mock-exam/{page_id}/question/{question_idx}?is_review=True'
            await page.goto(url, wait_until='domcontentloaded', timeout=15000)

            # 카테고리
            category = '1과목' if await page.locator('#content-container > div.main-section-title').inner_text() == '데이터 모델링의 이해' else '2과목'

            # 태그
            tag = await page.locator('#q-gb-nm').inner_text()
            
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
                # 'id': question_idx + 1,
                # 'page_id': page_id,
                'category': category,
                'tags': tag,
                'title': question_title,
                'content_img': image_url,
                'content_text': text_part,
                'choices_1': choices[0] if len(choices) > 0 else None,
                'choices_2': choices[1] if len(choices) > 1 else None,
                'choices_3': choices[2] if len(choices) > 2 else None,
                'choices_4': choices[3] if len(choices) > 3 else None,
                'answer': answer
            }

            await asyncio.sleep(random.uniform(0.3, 0.8))  # 랜덤 대기
            return data

        except Exception as e:
            print(f"⚠️ 문제 {question_idx} 수집 중 에러 발생: {e}")
            return None

    async def collect_questions(self, page, page_id):
        """한 세트의 문제들을 수집"""
        collected_in_session = []
        
        try:
            question_range = range(50)  # 0부터 49까지
            
            for question_idx in tqdm(question_range, desc=f"문제 수집 (ID: {page_id})"):
                data = await self.fetch_question_data(page, page_id, question_idx)
                if data:
                    collected_in_session.append(data)
                    self.total_collected += 1
                    
                    # 진행 상황 출력
                    if (question_idx + 1) % 10 == 0:
                        print(f"📊 진행: {question_idx + 1}/50 문제 완료 (총 수집: {self.total_collected}개)")
                        
        except Exception as e:
            print(f"❌ 문제 수집 중 에러: {e}")
            
        return collected_in_session

    async def get_new_question_set(self, page):
        """새로운 문제 세트 시작"""
        try:
            await page.goto('https://www.sqld.kr/', timeout=30000)
            await asyncio.sleep(2)

            # 모의고사 버튼 클릭
            await page.wait_for_selector('#mock-exam-button', timeout=15000)
            await asyncio.sleep(2)
            await page.locator('#mock-exam-button').click()

            # 문제지 고유 번호 추출
            await page.wait_for_selector('#content-container > div.question-content', timeout=15000)
            match = re.search(r'/mock-exam/(\d+)/', page.url)
            if match:
                page_id = match.group(1)
                print(f"🔄 새로운 문제지 ID: {page_id}")
                return page_id
            else:
                raise Exception("새 문제지 ID를 찾을 수 없습니다.")
                
        except Exception as e:
            print(f"❌ 새 문제 세트 시작 중 에러: {e}")
            raise

    def save_results(self, additional_data=None):
        """결과를 파일로 저장"""
        try:
            if additional_data:
                self.results.extend(additional_data)
            
            if self.results:
                # 데이터 디렉토리 생성
                os.makedirs('data', exist_ok=True)
                
                # 타임스탬프 포함한 파일명
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f'data/sqld_kr_data_{timestamp}.csv'
                
                df = pd.DataFrame(self.results)
                df.to_csv(filename, encoding='utf-8', index=False)
                print(f"💾 {len(self.results)}개 문제 데이터가 {filename}에 저장되었습니다.")
                return filename
            else:
                print("⚠️ 저장할 데이터가 없습니다.")
                return None
                
        except Exception as e:
            print(f"❌ 데이터 저장 중 에러: {e}")
            return None

    def print_status(self):
        """현재 상태 출력"""
        elapsed_time = time.time() - self.start_time
        hours = int(elapsed_time // 3600)
        minutes = int((elapsed_time % 3600) // 60)
        
        print(f"""
        ═══════════════════════════════════════
        📈 크롤링 현황
        ═══════════════════════════════════════
        🏃 세션 수: {self.session_count}
        📚 총 수집 문제: {self.total_collected}개
        ⏱️ 경과 시간: {hours}시간 {minutes}분
        💾 메모리 내 데이터: {len(self.results)}개
        ═══════════════════════════════════════
        """)

    async def run_single_session(self):
        """단일 세션 실행"""
        browser = None
        context = None
        page = None
        
        try:
            async with async_playwright() as playwright:
                # 브라우저 시작
                browser = await playwright.chromium.launch(
                    headless=False,
                    args=[
                        '--disable-blink-features=AutomationControlled',
                        '--no-first-run',
                        '--disable-background-timer-throttling'
                    ]
                )
                context = await browser.new_context(
                    viewport={'width': 1280, 'height': 720}
                )
                page = await context.new_page()
                page.set_default_timeout(30000)
                
                # 로그인하고 첫 문제지 시작
                page_id = await self.login_and_get_page_id(page)
                
                # 지속적으로 문제 수집
                collected_count = 0
                while collected_count < 10:  # 한 세션당 최대 10세트
                    print(f"🚀 세트 {collected_count + 1} 시작...")
                    
                    # 문제 수집
                    session_data = await self.collect_questions(page, page_id)
                    
                    if session_data:
                        self.results.extend(session_data)
                        collected_count += 1
                        print(f"✅ 세트 {collected_count} 완료 ({len(session_data)}개 문제)")
                        
                        # 중간 저장 (100개씩 수집할 때마다)
                        if len(self.results) >= 100:
                            self.save_results()
                            self.results = []  # 메모리 정리
                        
                        # 다음 문제 세트 시작
                        if collected_count < 10:
                            try:
                                page_id = await self.get_new_question_set(page)
                                await asyncio.sleep(random.randint(2, 5))
                            except Exception as e:
                                print(f"⚠️ 새 문제 세트 시작 실패: {e}")
                                break
                    else:
                        print("⚠️ 이번 세트에서 수집된 데이터가 없습니다.")
                        break
                        
                self.session_count += 1
                
        except Exception as e:
            print(f"❌ 세션 실행 중 치명적 에러: {e}")
            
        finally:
            # 리소스 정리
            if page:
                try:
                    await page.close()
                except:
                    pass
            if context:
                try:
                    await context.close()
                except:
                    pass
            if browser:
                try:
                    await browser.close()
                except:
                    pass

    async def run_forever(self):
        """무한 실행 메인 루프"""
        print("🚀 SQLD 크롤러 시작 - 무한 모드")
        print("Ctrl+C로 안전하게 종료할 수 있습니다.")
        
        while True:
            try:
                print(f"\n🔄 새로운 세션 시작...")
                self.print_status()
                
                await self.run_single_session()
                
                # 세션 간 대기
                wait_time = random.randint(10, 20)
                print(f"😴 다음 세션까지 {wait_time}초 대기...")
                await asyncio.sleep(wait_time)
                
            except KeyboardInterrupt:
                print("\n⚠️ 사용자가 중단을 요청했습니다.")
                break
                
            except Exception as e:
                print(f"❌ 예상치 못한 에러 발생: {e}")
                print("🔄 5초 후 자동으로 재시작합니다...")
                await asyncio.sleep(5)
                continue
        
        # 종료 시 최종 저장
        print("💾 최종 데이터 저장 중...")
        final_file = self.save_results()
        if final_file:
            print(f"✅ 최종 데이터가 {final_file}에 저장되었습니다.")
        
        self.print_status()
        print("👋 크롤링이 종료되었습니다.")

def main():
    """메인 실행 함수"""
    crawler = SQLDCrawler()
    
    try:
        asyncio.run(crawler.run_forever())
    except KeyboardInterrupt:
        print("\n프로그램이 안전하게 종료되었습니다.")
    except Exception as e:
        print(f"메인 프로세스 에러: {e}")
        print("프로그램을 재시작하세요.")

if __name__ == "__main__":
    main()