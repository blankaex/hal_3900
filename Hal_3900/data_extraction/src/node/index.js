//  IMPORTS
const fs = require('fs');

const scraper = require('./scrape.js');
const process = require('./process.js');
const analyze = require('./analyze.js');

// ------ SCRAPING FROM WEB ------

// TO SCRAPE PAGES LISTED IN pagesToScrape.json
scraper.scrapeSpecified("./pagesToScrape.json");

// ------ PROCESSING HTML FILES ------

// TO PROCESS HTML FILES INTO JSON DATA
// process.processFiles("../html/", "../data/");

// TO PROCESS SINGLE HTML FILE INTO JSON
// const html = fs.readFileSync("../html/course_outline.html");
// const data = process.parseData(html);
// fs.writeFileSync("../data/test.json", JSON.stringify(data));

// ------ ANALYZE TEXT WITH GOOGLE CLOUD NLP ------

// ANALYSIS OF SINGLE FILE
// const filename = "../data/notes_e.json";
// notes_e, notes_f, notes_g not done, QUOTA problems.
// data is fairly trashy here, needs a lot of work to improve
// needs more grouping which will also reduce number of small NLP calls


// analyze.analyzeFile(filename)
//     .then(object => fs.writeFileSync(filename, JSON.stringify(object)))
//     .catch(err => console.log(err.message));

//ANALYSIS OF ALL FILES IN DIRECTORY

// YOU MAY RUN INTO QUOTA PROBLEMS -> THIS NEEDS SOME EXPLORATION
// analyze.analyzeAll("../data/");

// const test = async () => {
//     const questionPage = await scraper.getPage({"address":"https://webcms3.cse.unsw.edu.au/COMP1521/18s2/forums/2714116"});
//     fs.writeFileSync("test.html", questionPage);
//     console.log( process.getForumPostObject(questionPage, []));
//
// };
