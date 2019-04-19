import json
import os

# change the model of forum entry to:
# forum: {'question': question, 'answers': [answer,...,answer]}
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
                     entry = {"question" : texts['question']}
                     entry["answers"] = texts['answers']
                     corpus_forum.append(entry)

         f.close()


forum_ct = {"forum" : corpus_forum}


jsObj = json.dumps(forum_ct)

fileObject = open('forum.json', 'w')
fileObject.write(jsObj)
fileObject.close()