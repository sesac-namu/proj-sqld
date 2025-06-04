import pandas as pd

# 파일 읽기
def read_files(files) -> pd.DataFrame:
    if isinstance(files, list):
        dfs = []
        for file in files:
            df = pd.read_csv(file, encoding='utf-8', index_col=0)
            dfs.append(df)

        df = pd.concat(dfs)
        return df
    else:
        df = pd.read_csv(files, encoding='utf-8', index_col=0)
        return df

# 중복 행 제거
def drop_dupli(df:pd.DataFrame) -> pd.DataFrame:
    new_df = []
    
    new_df.append(df[df['content_img'].notnull()].drop_duplicates(subset=['content_img']))
    new_df.append(df[(df['content_img'].isnull()) & df['content_text'].notnull()].drop_duplicates(subset=['content_text']))
    new_df.append(df[df['content_img'].isnull()].drop_duplicates(subset=['title']))
    # new_df.append(df[df['content_img'].isnull()].drop_duplicates(subset=['choices_1', 'choices_2', 'choices_3', 'choices_4']))
    new_df = pd.concat(new_df)
    

    
    return new_df