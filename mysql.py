import pymysql
from glob import glob
import pandas as pd
from process.data_process import read_files, drop_dupli

def connect_database():
    try:
        conn = pymysql.connect(
            host='127.0.0.1', 
            user='root', 
            password='1234567890', 
            db='sqldb', 
            charset='utf8'
            )
        return conn
    except Exception as e:
            print(f"데이터베이스 연결 오류: {e}")
            return None
    
def create_table():
    pass
    
def insert(df):
    connection = connect_database()
    if not connection:
        return False
    
    try:
        with connection.cursor() as cursor:
            sql = """
            INSERT INTO sqldata 
            (title, content_img, content_text, choice_1, choice_2, choice_3, choice_4, answer, category, tags)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            
            for _, data in df.iterrows():
                cursor.execute(sql, (
                    data['title'],
                    data['content_img'],
                    data['content_text'],
                    data['choices_1'],
                    data['choices_2'],
                    data['choices_3'],
                    data['choices_4'],
                    data['answer'],
                    data['category'],
                    data['tags']
                ))
        
        connection.commit()
        print(f"{len(df)}개의 데이터가 성공적으로 삽입되었습니다.")
        return True
        
    except Exception as e:
        print(f"데이터 삽입 오류: {e}")
        connection.rollback()
        return False
    finally:
        connection.close()

if __name__ == '__main__':
    files = glob('sqld_kr_data_20250604_153303 copy.csv')    

    # df = read_files(files)
    # df = drop_dupli(df)
    df = pd.read_csv('sqld_kr_data_20250604_153303 copy.csv', encoding='utf-8', index_col=False)
    df = df.where(pd.notnull(df), None)
    print(df.shape)
    print(df.columns)
    # for _, row in df.iterrows():
    #     print(row['category'])
    # df.to_csv('data/first_df.csv', encoding='utf-8', index=0)


    insert(df)