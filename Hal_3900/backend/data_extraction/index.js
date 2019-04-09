const scraper = require('./scrape.js');
const analyze = require('./analyze.js');
const task_queue = require('./start_queue.js');
const fs = require('fs');

// console.log("Data extractions functions currently commented out: choose what you want to do in index.js");

/**
 * Steps from start to finish:
 *  1. give 'pages to scrape' object to scraper.scrapeSpecified() -> JSON will be stores in data folders
 *  2. run analysis by passing data directories to analyze functions as below -> currently quota limited
 */

// ------ SCRAPING FROM WEB INTO PROCESSED FILES ------

// TO SCRAPE PAGES LISTED IN pagesToScrape.json.
// console.log("scraping first");
// scraper.scrapeSpecified(require("./pagesToScrape.json"));
// console.log("done");
// ------ ANALYZE TEXT WITH GOOGLE CLOUD NLP ------
// ------ (ANALYSIS OF ALL FILES IN DIRECTORY) ------

// YOU MAY RUN INTO QUOTA PROBLEMS -> THIS NEEDS SOME EXPLORATION
// analyze.analyzeDataDirectory("../data_page/");

// analyze.analyzeForumPostsDirectory("../data_forum/")

// ------ RUN TASK QUEUE ------
console.log("starting queue");
task_queue.run_queue();

