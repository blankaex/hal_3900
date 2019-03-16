// SCRAPER MODULES
const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');

const parseData = (html) => {

    let $ = cheerio.load(html);

    // GET ALL TABLES DATA
    const allTables = [];
    $("table").map((index, element) => {
        // TODO ideally we want the table's name/heading too.
        let tableRows = [];
        $(element).find("tr").map((i, e) => {
            // get the tablerow text, strip whitespace to singles
            const text = $(e).text().replace(/\s+/g, ' ');
            // construct js object
            tableRows.push({text});
        });
        allTables.push({tableRows});
    });

    // GET ALL PARAGRAPHS DATA
    const allParagraphs = [];
    $("p").map((index, element) => {
        // paragraph with stripped whitespace. could break them up further if needed
        const text = $(element).text().replace(/\s+/g, ' ');
        allParagraphs.push({text});
    });

    // GET ALL LIST DATA
    const allLists = [];
    $("li").map((index, element) => {
        const type = "list";
        // paragraph with stripped whitespace. could break them up further if needed
        const text = $(element).text().replace(/\s+/g, ' ');
        allLists.push({type}, text);
    });

    const results = {allTables, allParagraphs, allLists};

    return results;

};


// GET ALL LINKS FROM PAGE
const parseLinks = (html) => {
    const allLinks = [];

    let $ = cheerio.load(html);

    //TODO: filter which links more carefully

    $("a").map((index, element) => {
        const link = $(element).attr("href");
        if (link.toString().startsWith("/COMP1521/18s2/") && !seenSet.has(link.toString())
            && !link.toString().includes("groups/")
            && !link.toString().includes("admin/")
            && !link.toString().includes("classes/")) {
            allLinks.push({
                title: $(element).text(),
                linkURL: $(element).attr("href").toString()
            });
        }
    });
};

// PROCESS HTML FILES
const processFiles = (directory, destination) => {

    // OPEN FILES FROM HTML FOLDER ONE AT A TIME
    fs.readdir(directory, function (err, items) {
        console.log(items);
        items.forEach(i => {
            const html = fs.readFileSync(directory + i);
            const data = parseData(html);
            fs.writeFileSync(destination + i.replace(".html", ".json"), JSON.stringify(data));
        });
    });

    // PARSE TO GET DATA IN JSON FORMAT
    // WRITE JSON OBJECTS TO FILE
};


module.exports = {parseData, parseLinks, processFiles};
