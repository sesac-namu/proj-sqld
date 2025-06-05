import csv

with open("data.csv", "r", encoding="utf-8") as f:
    data_reader = csv.reader(f)

    data_reader.__next__()  # Skip the header row

    i = 0
    for row in data_reader:
        print(row)
        i += 1
        if i == 3:
            break
