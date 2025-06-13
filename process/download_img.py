import pandas as pd

import requests
from pathlib import Path

import os

def download_multiple_images(url, filename, folder="download_imgs"):
    """여러 이미지 일괄 다운로드"""
    # 폴더 생성
    Path(folder).mkdir(exist_ok=True)
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    # for i, url in enumerate(urls):
    try:
        response = requests.get(url, headers=headers, stream=True)
        response.raise_for_status()
        
        # 파일명 생성
        # parsed_url = urlparse(url)
        # filename = Path(parsed_url.path).name
        # if not filename or '.' not in filename:
            # Content-Type에서 확장자 추출 시도
            # content_type = response.headers.get('content-type', '')
            # if 'jpeg' in content_type or 'jpg' in content_type:
            #     ext = '.jpg'
            # elif 'png' in content_type:
            #     ext = '.png'
            # elif 'gif' in content_type:
            #     ext = '.gif'
            # else:
            #     ext = '.jpg'
        
        filepath = Path(folder) / filename
        
        # 파일 저장
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"다운로드 완료: {filepath}")
        
    except Exception as e:
        print(f"URL {url} 다운로드 실패: {e}")

def download_img_to_df(df:pd.DataFrame):
    for url in df[df['content_img'].notna() & df['content_img'].notna()]['content_img']:
    # for url in df['content_img']:
        if (not pd.isna(url)) and (not url == 'nan'):
            file = os.path.basename(url)
        # file_name = os.path.splitext(file)[0]
        
        download_multiple_images(url, file)

if __name__ == '__main__':
    df = pd.read_csv('finish_data.csv', encoding='utf-8')
    download_img_to_df(df)