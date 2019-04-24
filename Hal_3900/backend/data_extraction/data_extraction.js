const scraper = require('./scrape.js');
const analysis = require('./tfidf.js');
const fs = require('fs');

/**
 * This function is the base of our data extraction unit.
 *  * 1. Set up folders in filesystem to store data
 *  * 2. Save the user's input data, will allow flexibility later with adding more data
 *  * 3. Scrape data from the listed pages
 *  * 4. Process data to give keyword tags for our database and dialogflow
 *  * 5. Add the processed data to the database
 */

const getDataToDb = async (input, db) => {

    // set up course directory
    const data_folder = `../data/${input.courseCode}/`;
    try {
        fs.mkdirSync(data_folder, {recursive: true});
    } catch (err){
        console.error(err);
    }

    // save pagesToScrape for later
    fs.writeFileSync(`${data_folder}pagesToScrape.json`, JSON.stringify(input));

    // scrape listed pages and forum for data
    const scrapedData = await scraper.scrapeSpecified(input, data_folder);

    // process data with tf-idf algorithm
    const corpusPre = scrapedData.pageData;
    const corpusForum = scrapedData.forumData.map(item => item.question);

    const data = await analysis.buildModel(corpusPre, corpusForum, input.courseCode);

    // console.log(data.block);
    // insert data into Mongo
    await db.addToCollection(data.block, 'block');

    await db.addToCollection(scrapedData.forumData, 'forum');

};

module.exports = {getDataToDb};

