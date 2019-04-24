const scraper = require('./scrape.js');
const analysis = require('./tfidf.js');
const test_new = require('./testRunAnalysis.js');
const fs = require('fs');
/**
 * Steps from start to finish:
 *  1. give 'pages to scrape' object to scraper.scrapeSpecified() -> JSON will be stores in data folders
 *  2. run analysis through task queue. This limits the rate of Google Cloud NLP API calls to stay under QUOTA.
 */

const getDataToDb = async (input, db) => {
    // set up course directory
    const data_folder = `../data/${input.courseCode}/`;
    try {
        fs.mkdirSync(data_folder, {recursive: true});
    } catch (err){
        console.error(err);
    }

    // save pagesToScrape for laters :)
    fs.writeFileSync(`${data_folder}pagesToScrape.json`, JSON.stringify(input));

    await scraper.scrapeSpecified(input, data_folder);

    // consider running intent grouping to make the new tagging method easier - discuss with Yi
    // TODO rework the forum structure as per Bag-of-words wiki page
    // TODO output all tags and save them as a file for the data folder, to use for DF setup
    // Call Yi's function with inputs
    // CorpusPre = array of all texts: block = single text, group => put once as all items with \n between, and once as single line
    // CorpusForum = array of just questions of the forum (not answers)
    // courseCode goes into the database object
    // output should be block object from bag-of-words model on Wiki
    // In DB there will be no

    // block output contains array of outputs
    // insert the whole block into MongoDB


    //TODO input formats:

    // const cor = ['document is a file about c',
//                 'document word_ruby, de',
//                 'document ruby node'];
//
// const forum = ['this is a post',
//                 'a question'];

    // const data = analysis.buildModel(corpusPre,corpusForum,input.courseCode)

    // then just dump the data into DB!!!

    // await test_new.runAnalysis(db, data_forum_folder, data_page_folder);

};

module.exports = {getDataToDb};

