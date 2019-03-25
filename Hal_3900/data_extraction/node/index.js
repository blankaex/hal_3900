//  IMPORTS
const fs = require('fs');

const scraper = require('./scrape.js');
const process = require('./process.js');
const analyze = require('./analyze.js');

// ------ SCRAPING FROM WEB ------

// TO SCRAPE PAGES LISTED IN pagesToScrape.json
// scraper.scrapeSpecified("../pagesToScrape.json");

// ------ ANALYZE TEXT WITH GOOGLE CLOUD NLP ------

// ANALYSIS OF SINGLE FILE
const filename = "../data_page/notes_b.json";
// quota exhausted onl to notes_b


analyze.analyzeFile(filename)
    .then(object => fs.writeFileSync(filename, JSON.stringify(object)))
    .catch(err => console.log(err.message));

//ANALYSIS OF ALL FILES IN DIRECTORY

// YOU MAY RUN INTO QUOTA PROBLEMS -> THIS NEEDS SOME EXPLORATION
// analyze.analyzeAll("../data_page/");
// analyze.analyzeForumPostsDirectory("../data_forum/");


// const test = async () => {
//     const questionPage = await scraper.getPage({"address":"https://webcms3.cse.unsw.edu.au/COMP1521/18s2/forums/2714116"});
//     fs.writeFileSync("test.html", questionPage);
//     console.log( process.getForumPostObject(questionPage, []));
//
// };
