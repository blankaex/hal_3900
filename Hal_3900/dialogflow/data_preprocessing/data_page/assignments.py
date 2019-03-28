import json
import csv

''' Read JSON file of assignments to filter tags, 
	and store them into a csv file within the 
	format to meets requirments of dialogflow'''
	
with open('assignment_2.json','r',encoding = 'utf-8') as f2:
    dic = json.load(f2)

''' deal with grouped collection '''
keywords_2 = []
for texts in dic['grouped']:
    for tags in texts['items']:
        for t in tags['tags']:
            keywords_2.append(t['name'])



''' deal with block collection '''
for texts in dic['block']:
    for tags in texts['tags']:
        if isinstance(tags,str):
            keywords_2.append(tags)
            'print (tags)'
        
        else:            
            keywords_2.append(tags['name'])
f2.close()

with open('assignment_1.json',encoding = 'utf-8') as f1:
    dic = json.load(f1)

keywords_1 = []
for texts in dic['grouped']:
    for tags in texts['items']:
        for t in tags['tags']:
            keywords_1.append(t['name'])




for texts in dic['block']:
    for tags in texts['tags']:
        if isinstance(tags,str):
            keywords_1.append(tags)
            'print (tags)'
        
        else:            
           
            keywords_1.append(tags['name'])
f1.close()

keywords_without_redundancy = list(set(keywords_1+keywords_2))

'''store them into a csv file '''

with open('assignments.csv','w',encoding = 'utf-8',newline = '') as c:
    writer = csv.writer(c)
    for item in keywords_without_redundancy:
        writer.writerow([item,item])
c.close()








