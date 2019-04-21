const language = require('@google-cloud/language');
const dataType = require('./getDataType.js');

const client = new language.LanguageServiceClient();

// Entity Analysis on a single text with Google Cloud NLP,
// returns analysis as object
const analyze = async (text) => {
    // Prepares a document, representing the provided text
    const bareText = stripTextForTags(text);

    const document = {
        content: bareText,
        type: 'PLAIN_TEXT',
    };
    // Detects entities in the document
    return await client.analyzeEntities({document});
};

const stripTextForTags = (text) => {
    let newText = text.replace(/[\W_]+/g, ' ');              // strip ALL non-alphanumeric, replace with space
    newText = newText.replace(/\s+/g, ' ');                     // remove excess whitespace
    newText = newText.toLowerCase().trim();                     // tolower() and trim start/end whitespace
    return newText;
}

// code suggestion from https://codingwithspike.wordpress.com/2018/03/10/making-settimeout-an-async-await-function/
const wait = async (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
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
        return dataType.getTag(name, salience);
    });

    return await Promise.all(newTags);
};

const process_quiz_item = async (item) => {
    const newTags = await getNewTags(`${item.question} ${item.answer}`);
    return dataType.getQuizObject(item.id, item.question, item.answer, newTags);
};

const process_forum_item = async (item) => {
    const newTags = await getNewTags(item.question);
    return dataType.getForumObject(item.intent, item.courseCode, item.tags.concat(newTags), item.question, item.answers);
};

const process_block_item = async (item) => {
    const newTags = await getNewTags(item.text);
    return dataType.getBlock(item.intent, item.courseCode, item.tags.concat(newTags), item.text);
};

const process_grouped_item = async (group) => {
    const itemMap = group.items.map(async (item) => {
        const newTags = await getNewTags(item.text);
        return dataType.getBlock(item.intent, item.courseCode, item.tags.concat(newTags), item.text);
    });
    let items = await Promise.all(itemMap);     // await ensures all items finished in itemMap before proceeding
    return dataType.getGrouped(group.intent, group.courseCode, group.tags, items); // not altering group tags at this stage
};

module.exports = {process_quiz_item, process_forum_item, process_block_item, process_grouped_item};