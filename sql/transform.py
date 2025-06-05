import csv
import re

lines = []

with open("data.csv", "r", encoding="utf-8") as f:
    data_reader = csv.reader(f)

    data_reader.__next__()  # Skip the header row

    i = 0
    for row in data_reader:
        lines.append(row)
        i += 1

        if i == 10:
            break

with open("data.sql", "w", encoding="utf-8") as f:
    sql = "USE quiz;\n\ninsert into quiz (id, category, tags, title, content_img, content_text, choices1, choices2, choices3, choices4, answer, answer_explanation) values\n"

    id = 0

    for i in range(len(lines)):
        line = lines[i]
        answer = line[-1]

        id += 1
        sql += f"({id}, {(line[0][0])}, '{line[1]}', '{line[2]}', '{line[3]}', '{line[4]}', '{line[5]}', '{line[6]}', '{line[7]}', '{line[8]}', '{line[9]}')"

        if i < len(lines) - 1:
            sql += ",\n"

    print(sql)
