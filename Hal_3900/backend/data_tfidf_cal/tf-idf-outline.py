import json
import csv
from sklearn.feature_extraction.text import CountVectorizer
import numpy as np
from sklearn.feature_extraction.text import TfidfTransformer
np.set_printoptions(threshold=np.inf)


corpus = []

with open('data_page/course_outline.json','r',encoding = 'utf-8') as fc:
    dic = json.load(fc)
for texts in dic['block']:
        if isinstance(texts['text'], str):
            corpus.append(texts['text'])
for texts in dic['grouped']:
    t= []
    for item in texts['items']:
        t.append(item['text'])

    corpus.append(".".join(t))


fc.close()

# with open('corpus.csv','w',encoding = 'utf-8',newline = '') as c:
#     writer = csv.writer(c)
#     for item in corpus:
#         writer.writerow([item])
# c.close()

vectorizer = CountVectorizer()
X = vectorizer.fit_transform(corpus)
word = vectorizer.get_feature_names()
# with open('word_bag.csv','w',encoding = 'utf-8',newline = '') as c:
#     writer = csv.writer(c)
#     for item in word:
#         writer.writerow([item])
# c.close()
# with open('frenquce.csv','w',encoding = 'utf-8',newline = '') as c:
#     writer = csv.writer(c)
#     for item in X.toarray():
#         writer.writerow([item])
# c.close()
transformer = TfidfTransformer()
print(transformer)
tfidf = transformer.fit_transform(X)
weight = tfidf.toarray()
# with open('tfidf.csv','w',encoding = 'utf-8',newline = '') as c:
#     writer = csv.writer(c)
#     for item in weight:
#         writer.writerow([item])
# c.close()
# database = {}
# for i in range(len(weight)):
#     en = {}
#     for j in range(len(word)):
#         if(weight[i][j]!=0):
#             en[word[j]] = weight[i][j]
#     database[corpus[i]] = en
# with open('database.csv','w',encoding = 'utf-8',newline = '') as c:
#     writer = csv.DictWriter(c,database.keys())
#     writer.writerow(database)
#
# c.close()

block = []
for i in range(len(weight)):
    entry = {"intent": "outline"}
    entry["courseCode"] = "COMP1521"
    tags = []
    for j in range(len(word)):
        tag = {}
        if(weight[i][j]!=0):

            tag["name"] = word[j]
            tag["salience"] = weight[i][j]
            tag["theta"] = 1
            tags.append(tag)
            entry["tags"] = tags
    entry["text"] = corpus[i]
    block.append(entry)
block_ct = {"block" : block}
#print(block_ct)

jsObj = json.dumps(block_ct)

fileObject = open('outline_tfidf.json', 'w')
fileObject.write(jsObj)
fileObject.close()
