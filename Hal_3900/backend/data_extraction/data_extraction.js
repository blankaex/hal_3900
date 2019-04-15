const scraper = require('./scrape.js');
const task_queue = require('./taskQueue.js');
const test_new = require('./testRunAnalysis.js');

/**
 * Steps from start to finish:
 *  1. give 'pages to scrape' object to scraper.scrapeSpecified() -> JSON will be stores in data folders
 *  2. run analysis through task queue. This limits the rate of Google Cloud NLP API calls to stay under QUOTA.
 */

const getDataToDb = async (input, db) => {
    // await scraper.scrapeSpecified(input);
    // consider running intent grouping to make the new tagging method easier - discuss with Yi
    await test_new.runAnalysis(db);
};

module.exports = {getDataToDb};

