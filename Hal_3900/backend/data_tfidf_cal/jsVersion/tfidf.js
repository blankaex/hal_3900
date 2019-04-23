// const tfidf = require('tf-idf');
//


const natural = require('natural');
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();
const tokenizer = new natural.RegexpTokenizer({pattern: /([A-Za-z0-9]+)/});
//tokenizer = new natural.WordPunctTokenizer();



const cor = ['document is a file about c',
                'document word_ruby, de',
                'document ruby node'];

const forum = ['this is a post',
                'a question'];
//console.log(tfidf.listTerms(0 /*document index*/));
//     .forEach(function(item) {
//     console.log(item.term + ': ' + item.tfidf);
// });

const buildModel = async (corpusPre,corpusForum,courseCode) => {
    var corpus=[];
    var corpusFull = corpusPre.concat(corpusForum);
    corpusPre.map(x=>x.replace(/[^\w\s]|_/g, "")).map(x =>corpus.push(tokenizer.tokenize(x)));
    corpusForum.map(x=>x.replace(/[^\w\s]|_/g, "")).map(x =>corpus.push(tokenizer.tokenize(x)));
    //console.log(corpus);
    corpus.map(x=>tfidf.addDocument(x));
    //const corpusFull = corpusPre + corpusForum;
    //console.log(corpusFull);
    var block = [];
    for(var i =0; i<corpus.length; i++){

        var entry = {};
        entry.intent = "course";
        entry.courseCode = courseCode;
        if(i< corpusPre.length){entry.type = "answer";}else{entry.type = "question";}
        entry.tags = [];
        //console.log(tfidf.listTerms(i));
        tfidf.listTerms(i).forEach(function (item){
            var tag = {};
            tag.name = item.term; tag.sailence = item.tfidf;tag.theta = item.tfidf;
            entry.tags.push(tag);});
        entry.text = corpusFull[i];
        //console.log(corpusFull[i]);
        block.push(entry);
    }
    return {"block" : block};


};

console.log(buildModel(cor,forum));