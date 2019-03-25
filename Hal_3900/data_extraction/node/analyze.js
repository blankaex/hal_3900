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

// feed me text to get analysis of
// returns array of new tags
const getNewTags = async (text) => {
    // runs analysis, await ensures return value promise resolved before continuing
    const res = await analyze(text);
    const newTags = res[0].entities.map(entity => {
        const name = entity.name.toLowerCase();
        const salience = entity.salience;
        return {name, salience};
    });

    return await Promise.all(newTags);
};

// Calls entity analysis on each object in a single json file,
// Returns a json object with the new entity tags added
const analyzeFile = async (fileName) => {

    const pageData = require(fileName);

    const groupedList = async () => {

        // returns promise of array of "group" type data items
        const groupMap = pageData.grouped.map(async (group) => {
            // get tags for each group item
            const itemMap = group.items.map(async (item) => {
                const newTags = await getNewTags(item.text);
                const tags = item.tags.concat(newTags);
                return {tags, "text" : item.text};
            });

            let items = await Promise.all(itemMap);     // await ensures all items finished in itemMap before proceeding
            const tags = group.tags;                    // original group tags array
            return {tags, items};
        });
        return Promise.all(groupMap);
    };

    // returns promise of array of "block" type data items
    const blockList = async () => {
        const blockMap = pageData.block.map(async (item, index) => {
            const newTags = await getNewTags(item.text);
            const tags = item.tags.concat(newTags);
            return {tags, "text": item.text};
        });
        return Promise.all(blockMap);
    };

    // await used to ensure all analysis and tagging complete before returning the result
    const grouped = await groupedList();
    const block = await blockList();

    return {grouped, block};

};

const analyzeForumObject = async (forumObject) => {
    // analyze question for tags
    const postList = async () => {
        const postMap = forumObject.posts.map(async (item) => {
            const newTags = await getNewTags(item.question);
            // console.log(newTags);
            const tags = item.tags.concat(newTags);
            return {tags, "question": item.question, "answers": item.answers};
        });
        return Promise.all(postMap);
    };

    const posts = await postList();
    return {posts};
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

// Runs analysis on all forum objects found in the directory
const analyzeForumPostsDirectory = (directory) => {
    // read file entries from directory one at a time
    fs.readdir(directory, function (err, items) {

        items.forEach(async (i) => {
            const forumObject = require(directory + i);
            try {
                const result = await analyzeForumObject(forumObject);
                // NOTE: overwrites old file with updated object. Adds tag info only, no deletion of data
                fs.writeFileSync(directory + i, JSON.stringify(result));
            } catch (err) {
                console.error(err);
            }
        });
    });
};

module.exports = {analyzeFile, analyzeAll, analyzeForumPostsDirectory};