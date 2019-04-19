import json
import csv
from sklearn.feature_extraction.text import CountVectorizer
import numpy as np
from sklearn.feature_extraction.text import TfidfTransformer
import os
np.set_printoptions(threshold=np.inf)


# read all files inside data_page
# for block entries, simply insert into corpus
# for group entries, insert each text into corpus and insert the integration of all texts into corpus
path = "data_page"
files= os.listdir(path)
corpus = []
corpus_text = []
for file in files:
     if not os.path.isdir(file):
         with open("data_page/"+file, 'r', encoding='utf-8') as f:
             dic = json.load(f)

         for texts in dic['block']:
             if isinstance(texts['text'], str):
                 corpus_text.append(texts['text'])
         for texts in dic['grouped']:
             if (len(texts['items']) == 1):
                 corpus_text.append(texts['items'][0]['text'])
             else:
                 t=[]
                 for item in texts['items']:
                     corpus_text.append(item['text'])
                     t.append(item['text'])

                 corpus_text.append("\n".join(t))

         f.close()

# read all files in data_forum
# insert all questions into corpus
path = "data_forum"
files= os.listdir(path)
corpus_forum=[]
for file in files:
     if not os.path.isdir(file):
         with open("data_forum/"+file, 'r', encoding='utf-8') as f:
             dic = json.load(f)
         if(len(dic['posts'])!= 0):
             for texts in dic['posts']:
                 if isinstance(texts['question'], str):
                     corpus_forum.append(texts['question'])

         f.close()

corpus = corpus_text + corpus_forum # combime 2 corpuses
posts_start_index = len(corpus_text) # get the index of the first forum entry

# output the corpus
with open('corpus.csv','w',encoding = 'utf-8',newline = '') as c:
    writer = csv.writer(c)
    for item in corpus:
        writer.writerow([item])
c.close()

vectorizer = CountVectorizer()
#count numbers of each word
X = vectorizer.fit_transform(corpus)
#get words form word bag model
word = vectorizer.get_feature_names()
with open('word_bag.csv','w',encoding = 'utf-8',newline = '') as c:
    writer = csv.writer(c)
    for item in word:
        writer.writerow([item])
c.close()
with open('frenquce.csv','w',encoding = 'utf-8',newline = '') as c:
    writer = csv.writer(c)
    for item in X.toarray():
        writer.writerow([item])
c.close()
transformer = TfidfTransformer()
print(transformer)
#get tf-idf matrix
tfidf = transformer.fit_transform(X)
# weight[i][j]: tf-idf score of jth word in ith text
weight = tfidf.toarray()
with open('tfidf.csv','w',encoding = 'utf-8',newline = '') as c:
    writer = csv.writer(c)
    for item in weight:
        writer.writerow([item])
c.close()

# manage the structure of dataset, put them all into block collection
block = []

for i in range(posts_start_index):
    entry = {"intent": "content"}
    entry["courseCode"] = "COMP1521"
    entry["type"] = "answer"
    tags = []
    for j in range(len(word)):
        tag = {}
        if(weight[i][j]!=0):

            tag["name"] = word[j]
            tag["salience"] = weight[i][j]
            tag["theta"] = weight[i][j]
            tags.append(tag)
            entry["tags"] = tags
    entry["text"] = corpus[i]
    block.append(entry)

for i in range(posts_start_index, len(weight)):
    print(corpus[i])
    entry = {"intent": "content"}
    entry["courseCode"] = "COMP1521"
    entry["type"] = "question"
    tags = []
    for j in range(len(word)):
        tag = {}
        if(weight[i][j]!=0):
            print(word[j])
            print(weight[i][j])
            tag["name"] = word[j]
            tag["salience"] = weight[i][j]
            tag["theta"] = weight[i][j]
            tags.append(tag)
            entry["tags"] = tags
    entry["text"] = corpus[i]
    block.append(entry)

block_ct = {"block" : block}

# output the JSON file
jsObj = json.dumps(block_ct)

fileObject = open('block.json', 'w')
fileObject.write(jsObj)
fileObject.close()
