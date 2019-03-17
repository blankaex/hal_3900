// SCRAPER MODULES
const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');

// GOOGLE CLOUD NLP MODULES
const language = require('@google-cloud/language');

const client = new language.LanguageServiceClient();

const analyze = async (text) => {
    // Prepares a document, representing the provided text
    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };
    // Detects entities in the document
    const res = await client.analyzeEntities({document});
    return res;
};

const analyzeFile = async (fileName) => {

    // TODO get texts from JSON files
    // TODO add new tags, save to JSON file

    // object.grouped. => tags, items[text, text]
    // object.block => tags, text

    let object = require(fileName);

    object.grouped.forEach(group => {
        group.items.forEach(item => {
            analyze(item.text).then(res => {
                // console.log(res[0]);
                // print details of each entity
                res[0].entities.forEach(entity => {
                    group.tags.push(entity.name);
                    // TODO could also give salience score
                    // console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);
                });
            }).catch(err => console.log(err.message));
        })
    });

    object.block.forEach(item => {
        // console.log(item.text);
        analyze(item.text).then(res => {
            // console.log(res[0]);
            res[0].entities.forEach(entity => {
                // TODO could also give salience score
                item.tags.push(entity.name);
            })
        })
    });

};

module.exports = {analyze, analyzeFile};