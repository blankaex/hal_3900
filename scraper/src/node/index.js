// require modules
const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');

const baseURL = 'https://webcms3.cse.unsw.edu.au/';

let seenSet = new Set();

// const outlineURL = 'outline';

const getPageData = async (linkInfo) => {
    if (seenSet.has(linkInfo.linkURL)) {
        console.log("already seen " + linkInfo.title);
        return;
    }

    seenSet.add(linkInfo.linkURL);


    console.log("scraping... " + linkInfo.linkURL);
    // seenSet.add(linkInfo.linkURL);

    const html = await rp(baseURL + linkInfo.linkURL);
    // fs.writeFileSync("output.html", html);   -- use this to output HTML file and examine

    var $ = cheerio.load(html);

    // GET ALL TABLES DATA
    const allTables = [];
    $("table").map((index, element) => {
        // TODO ideally we want the table's name/heading too.
        const type = "table";
        let tableRows = [];
        $(element).find("tr").map((i, e) => {
            // get the tablerow text, strip whitespace to singles
            const text = $(e).text().replace(/\s+/g, ' ');
            // construct js object
            tableRows.push({text});
        });
        allTables.push({type, tableRows});
    });

    // GET ALL PARAGRAPHS DATA
    const allParagraphs = [];
    $("p").map((index, element) => {
        const type = "paragraph";
        // paragraph with stripped whitespace. could break them up further if needed
        const text = $(element).text().replace(/\s+/g, ' ');
        allParagraphs.push({type}, text);
    });

    // GET ALL LINKS DATA
    const allLinks = [];
    $("a").map((index, element) => {
        const link = $(element).attr("href");
        if (link.toString().startsWith("/COMP1521/18s2/") && !seenSet.has(link.toString())) {
            allLinks.push({
                title: $(element).text(),
                linkURL: $(element).attr("href").toString()
            });
        }
    });
    // console.log(allLinks);

    // WRITE OUT TO JSON
    const name = linkInfo.title.replace(/\s+/g, '-');

    const results = {name, allTables, allParagraphs};

    for (let i = 0; i < allLinks.length; i++) {
        getPageData(allLinks[i])
            .then(result =>
                fs.writeFileSync("src///data///" + result.name + ".json", JSON.stringify(result)))
            .catch(err => console.log("couldn't read page " + allLinks[i].linkURL));
    }

    return results;
};

const scrapePages = async () => {

    const homePage = "COMP1521/18s2/";
    const html = await rp(baseURL + homePage);

    const toScrape = {
        title: "home",
        linkURL: homePage
    };
    // seenSet.add(homePage);

    getPageData(toScrape).then(result =>
            fs.writeFileSync("src///data" + toScrape.title + ".json", JSON.stringify(result)))
        .catch(err => console.log("couldn't read page: " + toScrape.linkURL));

    return html;
};

scrapePages()
    .then(result => fs.writeFileSync("src///data///home.html", result))
    .catch(err => console.log("home page invalid"));

