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

const analyzeAll = () => {

    // TODO get texts from JSON files
    // TODO add new tags, save to JSON file

    analyze(text).then(res => {
        console.log(res[0]);
        // print details of each entity
        res[0].entities.forEach(entity => {
            console.log(entity.name);
            console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);

        });

    }).catch(err => console.log(err.message));
};

module.exports = {analyze, analyzeAll};