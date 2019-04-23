const scraper = require('./scrape.js');
const task_queue = require('./taskQueue.js');
const test_new = require('./testRunAnalysis.js');
const fs = require('fs');
/**
 * Steps from start to finish:
 *  1. give 'pages to scrape' object to scraper.scrapeSpecified() -> JSON will be stores in data folders
 *  2. run analysis through task queue. This limits the rate of Google Cloud NLP API calls to stay under QUOTA.
 */

const getDataToDb = async (input, db) => {
    // set up course directory
    const data_forum_folder = `../data/${input.courseCode}/data_forum/`;
    const data_page_folder = `../data/${input.courseCode}/data_page/`;
    try {
        fs.mkdirSync(data_forum_folder, {recursive: true});
        fs.mkdirSync(data_page_folder, {recursive: true});
    } catch (err){
        console.error(err);
    }

    await scraper.scrapeSpecified(input, data_forum_folder, data_page_folder);

    // consider running intent grouping to make the new tagging method easier - discuss with Yi
    // TODO rework the forum structure as per Bag-of-words wiki page
    // TODO output all tags and save them as a file for the data folder, to use for DF setup
    // Call Yi's function with inputs
    // CorpusPre = array of all texts: block = single text, group => put once as all items with \n between, and once as single line
    // CorpusForum = array of just questions of the forum (not answers)
    // courseCode goes into the database object
    // output should be block object from bag-of-words model on Wiki
    // In DB there will be no

    // block output contains array of outputs
    // insert the whole block into MongoDB


    await test_new.runAnalysis(db, data_forum_folder, data_page_folder);
};

module.exports = {getDataToDb};

