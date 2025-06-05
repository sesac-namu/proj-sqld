import csv
import re

lines = []

with open("data.csv", "r", encoding="utf-8") as f:
    data_reader = csv.reader(f)

    data_reader.__next__()  # Skip the header row

    for row in data_reader:
        line = row[:-1]
        answer = row[-1].split("\n")
        answer_number = answer[0].split(": ")[1]
        answer_explanation = answer[1] if len(answer) > 1 else ""
        line.append(answer_number)
        line.append(answer_explanation)

        for i in range(len(line)):
            line[i] = re.sub("'", "\\'", line[i])
            line[i] = re.sub("‘", "\\'", line[i])
            line[i] = re.sub("’", "\\'", line[i])
            line[i] = re.sub("：", ":", line[i])
            line[i] = re.sub("；", ";", line[i])

        lines.append(line)

with open("data.sql", "w", encoding="utf-8") as f:
    quiz_sql = "USE sqld;\n\ninsert into quiz (id, category, tags, title, content_img, content_text, choices_1, choices_2, choices_3, choices_4, multiple, answer_explanation) values\n"
    quiz_answer_sql = "insert into quiz_answer (quiz_id, answer) values\n"

    id = 0

    for i in range(len(lines)):
        line = lines[i]
        answer = list(map(int, line[-2].split(",")))

        id += 1
        quiz_sql += f"({id}, {(line[0][0])}, '{line[1]}', '{line[2]}', '{line[3]}', '{line[4]}', '{line[5]}', '{line[6]}', '{line[7]}', '{line[8]}', {'TRUE' if len(answer) != 1 else 'FALSE'}, '{line[10]}')"

        for a in answer:
            quiz_answer_sql += f"({id}, {a})"

            if a != answer[-1]:
                quiz_answer_sql += ",\n"

        if i < len(lines) - 1:
            quiz_sql += ",\n"
            quiz_answer_sql += ",\n"

    quiz_sql += ";\n\n"
    quiz_answer_sql += ";\n"

    sql = quiz_sql + quiz_answer_sql

    f.write(sql)
