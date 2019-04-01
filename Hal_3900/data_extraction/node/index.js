const scraper = require('./scrape.js');
const analyze = require('./analyze.js');
const fs = require('fs');

console.log("Data extractions functions currently commented out: choose what you want to do in index.js");

/**
 * Steps from start to finish:
 *  1. give 'pages to scrape' object to scraper.scrapeSpecified() -> JSON will be stores in data folders
 *  2. run analysis by passing data directories to analyze functions as below -> currently quota limited
 */

// ------ SCRAPING FROM WEB INTO PROCESSED FILES ------

// TO SCRAPE PAGES LISTED IN pagesToScrape.json.
// scraper.scrapeSpecified(require("../pagesToScrape.json"));

// ------ ANALYZE TEXT WITH GOOGLE CLOUD NLP ------
// ------ (ANALYSIS OF ALL FILES IN DIRECTORY) ------

// YOU MAY RUN INTO QUOTA PROBLEMS -> THIS NEEDS SOME EXPLORATION
// analyze.analyzeDataDirectory("../data_page/");

// analyze.analyzeForumPostsDirectory("../data_forum/");

const directory = "../data_page/";
const i = "notes_b.json";

// TODO
// notes_b
// notes_c
// notes_d
// notes_e
// notes_f
// notes_g

const dataObject = require(directory + i);
analyze.analyzePageObject(dataObject)
    .then(result => fs.writeFileSync(directory + i, JSON.stringify(result)));
