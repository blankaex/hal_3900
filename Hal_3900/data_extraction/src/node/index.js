// SCRAPER MODULES
const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');

// GOOGLE CLOUD NLP MODULES
const language = require('@google-cloud/language');


// IMPORTS
const scraper = require('./scrape.js');
const process = require('./process.js');
const analyze = require('./analyze.js');

// TO SCRAPE PAGES LISTED IN pagesToScrape.json
// TODO add forum scrape special component
// scraper.scrapeSpecified("./pagesToScrape.json");

// TO PROCESS HTML FILES INTO JSON DATA
// process.processFiles("../html/", "../data/");

// TO PROCESS SINGLE HTML FILE INTO JSON
// const html = fs.readFileSync("../html/course_outline.html");
// const data = process.parseData(html);
// fs.writeFileSync("../data/test.json", JSON.stringify(data));


// TO ANALYZE DATA WITH GOOGLE CLOUD, ADD TAGS TO JSON STRUCTURE

// ANALYSIS OF SINGLE FILE
analyze.analyzeFile("../data/assignment_2.json")
    .then(object => fs.writeFileSync("../data/test.json", JSON.stringify(object)))
    .catch(err => console.log(err.message));

//ANALYSIS OF ALL FILES IN DIRECTORY

// YOU MAY RUN INTO QUOTA PROBLEMS
// analyze.analyzeAll("../data/");

