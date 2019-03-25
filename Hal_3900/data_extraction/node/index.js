//  IMPORTS
const fs = require('fs');

const scraper = require('./scrape.js');
const process = require('./process.js');
const analyze = require('./analyze.js');

console.log("Functions currently commented out: choose what you want to do in index.js");

// ------ SCRAPING FROM WEB INTO PROCESSED FILES ------

// TO SCRAPE PAGES LISTED IN pagesToScrape.json
// scraper.scrapeSpecified("../pagesToScrape.json");

// ------ ANALYZE TEXT WITH GOOGLE CLOUD NLP ------

// ANALYSIS OF SINGLE PAGE FILE
// const filename = "../data_page/notes_e.json";

// analyze.analyzePageObject(require(filename));
//     .then(object => fs.writeFileSync(filename, JSON.stringify(object)))
//     .catch(err => console.log(err.message));

// ------ ANALYSIS OF ALL FILES IN DIRECTORY ------
// YOU MAY RUN INTO QUOTA PROBLEMS -> THIS NEEDS SOME EXPLORATION
// analyze.analyzeDataDirectory("../data_page/");
// analyze.analyzeForumPostsDirectory("../data_forum/");
