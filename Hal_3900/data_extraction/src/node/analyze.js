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

    const object = require(fileName);
    // console.log("hello");
    const groupedList = async () => {
        const groupMap = object.grouped.map(async (group, index) => {
            // console.log(group);
            const text = group.text;
            const textMap = group.items.map(async (item, index) => {
                // runs analysis,
                const res = await analyze(item.text);
                const newTags = [];
                res[0].entities.forEach(entity => {
                        newTags.push(entity.name.toLowerCase());
                        // TODO could also give salience score
                        // console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);
                });
                // console.log(newTags);
                return newTags;
            });
            let allTags = await Promise.all(textMap);
            const tags = group.tags;
            allTags.forEach(array => {
                array.forEach(tag => {
                    if (! tags.includes(tag)){
                        tags.push(tag);
                    }
                })
            });
            // tags = tags + group.tags;

            // console.log({tags, text});
            return {tags, text};
        });
        return Promise.all(groupMap);
    };

    const blockList = async () => {
        const blockMap = object.block.map(async (item, index) => {
            // console.log(item);
            // console.log(item.text);
            const text = item.text;
            const tagArray = item.tags;
            const tags = await analyze(text).then(res => {
                res[0].entities.forEach(entity => {
                    // TODO could also give salience score
                    tagArray.push(entity.name);
                });
                return tagArray;
            });
            return {tags, text};
        });
        return Promise.all(blockMap);
    };

    const grouped = await groupedList();
    const block = await blockList();

    return {grouped, block};

};

const analyzeAll = (directory) => {
    // OPEN FILES FROM DATA FOLDER ONE AT A TIME
    fs.readdir(directory, function (err, items) {
        // console.log(items);
        items.forEach(i => {
            analyzeFile(directory + i)
            // NOTE: overwrites old file, use with caution
                .then(object => fs.writeFileSync(directory + i, JSON.stringify(object)))
                .catch(err => console.log(err.message));
        });
    });
};

module.exports = {analyze, analyzeFile, analyzeAll};