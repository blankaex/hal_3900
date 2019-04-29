const natural = require('natural');
const TfIdf = natural.TfIdf;
const tokenizer = new natural.RegexpTokenizer({pattern: /([A-Za-z0-9]+)/});
const dataType = require('./getDataType.js');

// INPUT FORMATS
// const cor = ['document is a file about c',
//                 'document word_ruby, de',
//                 'document ruby node'];
//
// const forum = ['this is a post',
//                 'a question'];

const buildModel = (corpusPre,corpusForum,courseCode) => {
    const tfidf = new TfIdf();

    let corpus = [];
    let corpusFull = corpusPre.concat(corpusForum);
    const corpusBoundary = corpusPre.length;
    corpusPre.map(x => x.replace(/[^\w\s]|_/g, "")).map(x => corpus.push(tokenizer.tokenize(x)));
    corpusForum.map(x => x.replace(/[^\w\s]|_/g, "")).map(x => corpus.push(tokenizer.tokenize(x)));
    //console.log(corpus);
    corpus.map(x => tfidf.addDocument(x));
    //const corpusFull = corpusPre + corpusForum;
    //console.log(corpusFull);
    let block = [];
    let tagList = new Set();
    for (let i = 0; i < corpus.length; i++){

        // get type
        let type;
        if (i < corpusBoundary ) type = "answer";
        else type = "question";

        // get tags
        const tags = tfidf.listTerms(i).map(function (item){
            tagList.add(item.term);
            const name = item.term;
            const salience = item.tfidf;
            return dataType.getTag(name, salience); // sets theta = salience
        });

        // wrap as block object
        const entry = dataType.getBlock("course", courseCode, type, tags, corpusFull[i]);

        block.push(entry);
    }
    return { block, "tagList": Array.from(tagList.values()) };

};

module.exports = { buildModel };