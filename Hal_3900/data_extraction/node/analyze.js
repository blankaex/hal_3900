// SCRAPER MODULES
const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');

// GOOGLE CLOUD NLP MODULES
const language = require('@google-cloud/language');

const client = new language.LanguageServiceClient();

// Entity Analysis on a single text with Google Cloud NLP,
// returns analysis as object
const analyze = async (text) => {
    // Prepares a document, representing the provided text
    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };
    // Detects entities in the document
    return await client.analyzeEntities({document});
};


const tagItem = async (item, index) => {
    // runs analysis, await ensures return value promise resolved before continuing
    const text = item.text;
    const tagArray = item.tags;
    // store all new entities in newTags array
    // console.log(item);
    const tags = await analyze(text).then(res => {
        res[0].entities.forEach(entity => {
            const name = entity.name.toLowerCase();
            const salience = entity.salience;
            tagArray.push({name, salience});
        });
        return tagArray;
    });
    return {tags, text};
};

// Calls entity analysis on each object in a single json file,
// Returns a json object with the new entity tags added
const analyzeFile = async (fileName) => {

    const pageData = require(fileName);

    const groupedList = async () => {

        // returns promise of array of "group" type data items
        const groupMap = pageData.grouped.map(async (group, index) => {
            // get tags for each group item
            const itemMap = group.items.map( (item, index) => {
                return tagItem(item, index);
            });

            let items = await Promise.all(itemMap);     // await ensures all items finished in itemMap before proceeding
            const tags = group.tags;                    // original group tags array
            return {tags, items};
        });
        return Promise.all(groupMap);
    };

    // returns promise of array of "block" type data items
    const blockList = async () => {
        const blockMap = pageData.block.map((item, index) => {
            return tagItem(item, index)
        });
        return Promise.all(blockMap);
    };

    // await used to ensure all analysis and tagging complete before returning the result
    const grouped = await groupedList();
    const block = await blockList();

    return {grouped, block};

};

// Runs analysis on all files found in the directory
const analyzeAll = (directory) => {
    // read file entries from directory one at a time
    fs.readdir(directory, function (err, items) {

        items.forEach(i => {
            analyzeFile(directory + i)
            // NOTE: overwrites old file with updated object. Adds tag info only, no deletion of data
                .then(object => fs.writeFileSync(directory + i, JSON.stringify(object)))
                .catch(err => console.log(err.message));
        });
    });
};

module.exports = {analyzeFile, analyzeAll};