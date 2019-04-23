const natural = require('natural');
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();
const tokenizer = new natural.RegexpTokenizer({pattern: /([A-Za-z0-9]+)/});
const dataType = require('./getDataType.js');
//tokenizer = new natural.WordPunctTokenizer();


// INPUT FORMATS
// const cor = ['document is a file about c',
//                 'document word_ruby, de',
//                 'document ruby node'];
//
// const forum = ['this is a post',
//                 'a question'];



const buildModel = async (corpusPre,corpusForum,courseCode) => {
    let corpus = [];
    let corpusFull = corpusPre.concat(corpusForum);
    corpusPre.map(x => x.replace(/[^\w\s]|_/g, "")).map(x => corpus.push(tokenizer.tokenize(x)));
    corpusForum.map(x => x.replace(/[^\w\s]|_/g, "")).map(x => corpus.push(tokenizer.tokenize(x)));
    //console.log(corpus);
    corpus.map(x => tfidf.addDocument(x));
    //const corpusFull = corpusPre + corpusForum;
    //console.log(corpusFull);
    let block = [];
    for (let i = 0; i < corpus.length; i++){
        let entry = {};
        entry.intent = "course";
        entry.courseCode = courseCode;
        if (i < corpusPre.length ){
            entry.type = "answer";
        } else {
            entry.type = "question";
        }
        entry.tags = [];
        //console.log(tfidf.listTerms(i));
        tfidf.listTerms(i).forEach(function (item){
            const tag = dataType.getTag(item.term, item.tfidf);
            entry.tags.push(tag);
        });
        entry.text = corpusFull[i];
        //console.log(corpusFull[i]);
        block.push(entry);
    }
    return {"block" : block};


};

module.exports = { buildModel };