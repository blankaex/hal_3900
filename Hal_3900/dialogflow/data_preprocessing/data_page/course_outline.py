import json
import csv
''' Read JSON file of course outline to filter tags, 
	and store them into a csv file within the 
	format to meets requirments of dialogflow'''
	
with open('course_outline.json','r',encoding = 'utf-8') as fc:
    dic = json.load(fc)

keywords = []
''' deal with grouped collection '''
for texts in dic['grouped']:
    for tags in texts['items']:
        for t in tags['tags']:
            keywords.append(t['name'])



''' deal with block collection '''
for texts in dic['block']:
    for tags in texts['tags']:
        if isinstance(tags,str):
            keywords.append(tags)
            'print (tags)'
        
        else:            
            keywords.append(tags['name'])
fc.close()

keywords_without_redundancy = list(set(keywords))

'''store them into a csv file '''
with open('course_outline.csv','w',encoding = 'utf-8',newline = '') as c:
    writer = csv.writer(c)
    for item in keywords_without_redundancy:
        writer.writerow([item,item])
c.close()
