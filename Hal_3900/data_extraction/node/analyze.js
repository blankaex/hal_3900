// SCRAPER MODULES
const fs = require('fs');

// GOOGLE CLOUD NLP MODULES
const language = require('@google-cloud/language');

const client = new language.LanguageServiceClient();

const getTag = (name, salience) => {
    const theta = 1;
    return {name, salience, theta};
};

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
    // check if text < 3 words
    const res = await analyze(text);
    const newTags = res[0].entities.map(entity => {
        const name = entity.name.toLowerCase();
        const salience = entity.salience;
        return getTag(name, salience);
    });

    return await Promise.all(newTags);
};

// feed me an object from the data_page directory
// returns same object with added tags from analysis
const analyzePageObject = async (dataObject) => {

    const groupedList = async () => {

        // returns promise of array of "group" type data items
        const groupMap = dataObject.grouped.map(async (group) => {
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
        const blockMap = dataObject.block.map(async (item, index) => {
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

// feed me an object from the data_forum directory
// returns same object with added tags from analysis
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

// Runs analysis on all files found in the page type directory
const analyzePageDirectory = (directory) => {
    // read file entries from directory one at a time
    fs.readdir(directory, function (err, items) {

        items.forEach(async (i) => {
            const dataObject = require(directory + i);
            try {
                const result = await analyzePageObject(dataObject);
                fs.writeFileSync(directory + i, JSON.stringify(result));
            } catch (err) {
                console.error(err);
            }
        });
    });
};



module.exports = {analyzePageObject, analyzePageDirectory, analyzeForumPostsDirectory, getNewTags};