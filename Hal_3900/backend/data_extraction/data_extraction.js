const scraper = require('./scrape.js');
const analyze = require('./analyze.js');
const task_queue = require('./taskQueue.js');
const fs = require('fs');

/**
 * Steps from start to finish:
 *  1. give 'pages to scrape' object to scraper.scrapeSpecified() -> JSON will be stores in data folders
 *  2. run analysis by passing data directories to analyze functions as below -> currently quota limited
 */

// TODO sort out synchronisation of components (step 1 must complete before starting step 2)

// ------ GET INITIAL DATA OBJECTS ------

const getDataToDb = async (input, db) => {
    await scraper.scrapeSpecified(input);
    task_queue.runAnalysis(db);
};

module.exports = {getDataToDb};


// ------ RUN TASK QUEUE ------

// task_queue.runAnalysis();

