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

    // save pagesToScrape for laters :)
    fs.writeFileSync(`../data/${input.courseCode}`, JSON.stringify(input));

    await scraper.scrapeSpecified(input, data_forum_folder, data_page_folder);

    // consider running intent grouping to make the new tagging method easier - discuss with Yi
    // await task_queue.runAnalysis(db);  --> if running through NLP analysis
    await test_new.runAnalysis(db, data_forum_folder, data_page_folder); // --> if putting from json straight to db
};

module.exports = {getDataToDb};

