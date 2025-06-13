import pandas as pd

# 파일 읽기
def read_files(files) -> pd.DataFrame:
    # 데이터 하나로 합치기
    if isinstance(files, list):
        dfs = []
        for file in files:
            df = pd.read_csv(file, encoding='utf-8', index_col=False)
            dfs.append(df)

        df = pd.concat(dfs)
        return df
    else:
        df = pd.read_csv(files, encoding='utf-8', index_col=False)
        return df

# 중복 행 제거
def drop_dupli(df:pd.DataFrame) -> pd.DataFrame:
    new_df = []
    
    # 같은 이미지 url(중복 문제) 제거
    new_df.append(df[df['content_img'].notnull()].drop_duplicates(subset=['content_img']))
    # 같은 지문 텍스트(중복 문제) 제거
    new_df.append(df[df['content_text'].notnull()].drop_duplicates(subset=['content_text']))
    # 이미지와 지문이 없는 문제에서 중복 문제 제거
    df[df['content_img'].isnull() & df['content_text'].isnull()].drop_duplicates(subset=['title'])

    new_df = pd.concat(new_df)
    
    return new_df

def add_answer_commentary(df: pd.DataFrame) -> pd.DataFrame:
    # 인덱스 초기화
    df.reset_index(inplace=True)
    df.drop(['index'], axis=1, inplace=True)
    df['commentary'] = ''
    df['answer_number'] = ''
    
    # 정답에서 숫자, 해설을 분리
    for idx, row in df.iterrows():
        answer_text = str(row['answer']) if pd.notna(row['answer']) else ''
        
        if '\n' in answer_text:
            parts = answer_text.split('\n', 1)
            answer = parts[0].replace('정답: ', '').strip()
            commentary = parts[1].replace('해설: ', '').strip() if len(parts) > 1 else ''
        else:
            answer = answer_text.replace('정답: ', '').strip()
            commentary = ''
        
        if commentary == 'None':
            commentary = ''
        
        df.at[idx, 'answer_number'] = answer
        df.at[idx, 'commentary'] = commentary
    
    return df

# 이상한 문자 바꾸기
def processing(df:pd.DataFrame) -> pd.DataFrame:
    replace_map = {
        '‘': '\'',
        '’': '\'',
        '：': ':',
        '；': ';',
    }
    columns_to_clean = ['title','content_text', 'choices_1', 'choices_2', 'choices_3', 'choices_4', 'commentary']

    for col in columns_to_clean:
        for old_char, new_char in replace_map.items():
            df[col] = df[col].str.replace(old_char, new_char, regex=False)

    return df