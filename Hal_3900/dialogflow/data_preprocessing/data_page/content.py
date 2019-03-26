import json
import csv

notes = ['notes_a.json','notes_b.json','notes_c.json','notes_d.json']
keywords = []
for path in notes:
    with open(path,'r',encoding = 'utf-8') as f:
        dic = json.load(f)

    
    for texts in dic['grouped']:
        for tags in texts['items']:
            for t in tags['tags']:
                keywords.append(t['name'])




    for texts in dic['block']:
        for tags in texts['tags']:
            if isinstance(tags,str):
                keywords.append(tags)
                'print (tags)'
            
            else:            
                keywords.append(tags['name'])
    f.close()

keywords_without_redundancy = list(set(keywords))
print (len(keywords_without_redundancy))

with open('content.csv','w',encoding = 'utf-8',newline = '') as c:
    writer = csv.writer(c)
    for item in keywords_without_redundancy:
        writer.writerow([item,item])
c.close()
