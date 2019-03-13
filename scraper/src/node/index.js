// require modules
const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');

const baseURL = 'https://webcms3.cse.unsw.edu.au/';
// const outlineURL = 'outline';

const getPageData = async (linkInfo) => {

    const html = await rp(baseURL + linkInfo.linkURL);
    // fs.writeFileSync("output.html", html);   -- use this to output HTML file and examine

    var $ = cheerio.load(html);

    // GET ALL TABLES DATA
    const allTables = [];
    $("table").map((index, element)=> {
        // TODO ideally we want the table's name/heading too.
        const type = "table";
        let tableRows = [];
        $(element).find("tr").map((i,e)=> {
            // get the tablerow text, strip whitespace to singles
            const text = $(e).text().replace(/\s+/g,' ');
            // tableRows.push($(e).text().replace(/\s+/g,' '));
            // construct js object
            tableRows.push({text});
            // console.log(tableRows[i]);
        });
        allTables.push({type, tableRows});
    });

    // GET ALL PARAGRAPHS DATA
    const allParagraphs = [];
    $("p").map((index, element)=> {
        const type = "paragraph";
        // paragraph with stripped whitespace. could break them up further if needed
        const text = $(element).text().replace(/\s+/g,' ');
        allParagraphs.push({type}, text);
    });

    // WRITE OUT TO JSON
    const name = linkInfo.title.replace(/\s+/g,'-');
    return {name, allTables, allParagraphs};
};

const scrapePages = async ()=> {
    // setup: init queue for graph BFS "seen" set for web crawling
    // MIGHT BE ABLE TO LIMIT DEPTH TO AVOID THE LITTLE LINKS WE DON'T WANT
    // ONLY USE LINKS GOING TO OUR PAGES, AVOID OUTSIDE -> STARTING WITH "/"
    let seenSet = new Set();
    const addressList = []; // use a queue library for this to avoid it being inefficient??

    const homePage = "COMP1521/18s2/";
    const forumBase = "COMP1521/18s2/forums/";
    // step 1: get first URLS to follow
    let html;
    try {
        html = await rp(baseURL + homePage);
    } catch (err){
        console.log('Http Error');
        return;
    }
    // fs.writeFileSync("home.html", html);
    var $ = cheerio.load(html);
    $("a").map((index, element)=> {
        const link = $(element).attr("href");
        if (link.toString().startsWith("/COMP1521/18s2/")){
            addressList.push({
                title: $(element).text(),
                linkURL: $(element).attr("href").toString()
            });
        }
    });
    console.log(addressList);
    // step 2: follow links in BFS pattern
    for (let i=0; i<addressList.length; i++){
            getPageData(addressList[i]).then(result =>
                fs.writeFileSync("src///data///" + result.name + ".json", JSON.stringify(result)))
                .catch( err =>
                    console.log("couldn't read page " + addressList[i].linkURL));
    }

};

scrapePages();

// getPageData().then(result => {
//     fs.writeFileSync(result.name + ".json", JSON.stringify(result));
// });
