import pymysql

def connect_database():
    try:
        conn = pymysql.connect(
            host='127.0.0.1', 
            user='root', 
            password='1234', 
            db='sqldb', 
            charset='utf8'
            )
        return conn
    except Exception as e:
            print(f"데이터베이스 연결 오류: {e}")
            return None
    
def insert(data_list):
    connection = connect_database()
    if not connection:
        return False
    
    try:
        with connection.cursor() as cursor:
            sql = """
            INSERT INTO sqldata 
            (title, content_img, content_text, choice1, choice2, choice3, choice4, answer, category, tag)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            
            for data in data_list:
                cursor.execute(sql, (
                    data['title'],
                    data['content_img'],
                    data['content_text'],
                    data['choice1'],
                    data['choice2'],
                    data['choice3'],
                    data['choice4'],
                    data['answer'],
                    data['category'],
                    data['tag']
                ))
        
        connection.commit()
        print(f"{len(data_list)}개의 데이터가 성공적으로 삽입되었습니다.")
        return True
        
    except Exception as e:
        print(f"데이터 삽입 오류: {e}")
        connection.rollback()
        return False
    finally:
        connection.close()

if __name__ == '__main__':
    
    insert(sample_data_list)