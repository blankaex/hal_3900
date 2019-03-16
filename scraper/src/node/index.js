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
// TODO improve data extraction and JSON structure
process.processFiles("../html/", "../data/");

// TO ANALYZE DATA WITH GOOGLE CLOUD, ADD TAGS TO JSON STRUCTURE
// TODO
// analyze.analyzeAll();


