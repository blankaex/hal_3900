const scraper = require('./scrape.js');
const task_queue = require('./taskQueue.js');

/**
 * Steps from start to finish:
 *  1. give 'pages to scrape' object to scraper.scrapeSpecified() -> JSON will be stores in data folders
 *  2. run analysis through task queue. This limits the rate of Google Cloud NLP API calls to stay under QUOTA.
 */

const getDataToDb = async (input, db) => {
    await scraper.scrapeSpecified(input);
    task_queue.runAnalysis(db);
};

module.exports = {getDataToDb};

