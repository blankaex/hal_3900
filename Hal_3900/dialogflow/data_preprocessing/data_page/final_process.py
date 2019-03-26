import json
import csv

paths = ['assignments.csv','course_outline.csv','content.csv']
asst = []
outline = []
content = []
with open(paths[0],'r',encoding = 'utf-8') as f:
    reader = csv.reader(f)
    for row in reader:
        asst.append(row[0])
f.close()

with open(paths[1],'r',encoding = 'utf-8') as f:
    reader = csv.reader(f)
    for row in reader:
        outline.append(row[0])
f.close()

with open(paths[2],'r',encoding = 'utf-8') as f:
    reader = csv.reader(f)
    for row in reader:
        content.append(row[0])
f.close()

sasst = set(asst)
soutline = set(outline)
scontent = set(content)
f=[]
f.append( list(sasst-scontent-soutline))
f.append ( list(soutline - scontent))
f.append (list(scontent))


fpaths = ['assignments_info.csv','course_outline_info.csv','content_info.csv']

for i in range(0,3):
    with open(fpaths[i],'w',encoding = 'utf-8',newline = '') as c:
        writer = csv.writer(c)
        for item in f[i]:
            writer.writerow([item,item])
    c.close()
    print('1')

        
