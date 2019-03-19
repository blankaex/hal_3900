// SCRAPER MODULES
const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');

const parseData = (html) => {

    let $ = cheerio.load(html);

    // GET ALL TABLES DATA
    const grouped = [];
    $("table").each((index, element) => {
        const items = [];
        const tags = [];
        tags.push("table");
        const prev = $(element).prev();
        if (prev.is("h1") ||  prev.is("h2") || prev.is("h3")
            || prev.is("h4") || prev.is("h5") || prev.is("h6")){
            tags.push(prev.text().replace(/\s+/g, ' '));
        }
        $(element).find("tr").map((i, e) => {
            // get the tablerow text, strip whitespace to singles
            const text = $(e).text().replace(/\s+/g, ' ');
            const tags = []; // these tags will extract from text
            // construct js object
            items.push({tags, text});
        });
        grouped.push({tags, items});
    });

    // GET ALL LIST DATA
    $("ul").map((index, element) => {
        let items = [];
        const tags = [];
        tags.push("list");
        const prev = $(element).prev();
        if (prev.is("h1") ||  prev.is("h2") || prev.is("h3")
            || prev.is("h4") || prev.is("h5") || prev.is("h6")){
            tags.push(prev.text().replace(/\s+/g, ' '));
        }
        $(element).find("li").each((i, e) => {
            // paragraph with stripped whitespace. could break them up further if needed
            const text = $(e).text().replace(/\s+/g, ' ');
            const tags = []; // these tags will extract from data
            items.push({tags, text});
        });
        grouped.push({tags, items});
    });

    // GET ALL PARAGRAPHS DATA
    const block = [];
    $("p").map((index, element) => {
        const tags = [];
        tags.push("paragraph");
        const prev = $(element).prev();
        if (prev.is("h1") ||  prev.is("h2") || prev.is("h3")
            || prev.is("h4") || prev.is("h5") || prev.is("h6")){
            tags.push(prev.text().replace(/\s+/g, ' '));
        }
        // paragraph with stripped whitespace. could break them up further if needed
        const text = $(element).text().replace(/\s+/g, ' ');
        block.push({tags, text});
    });

    return {grouped, block};

};




// GET ALL LINKS FROM PAGE
const parseLinks = (html) => {
    const allLinks = [];

    let $ = cheerio.load(html);

    $("a").map((index, element) => {
        const link = $(element).attr("href");
        if (link.toString().startsWith("/COMP1521/18s2/")
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
            // PARSE TO GET DATA IN JSON FORMAT
            const data = parseData(html);
            // WRITE JSON OBJECTS TO FILE
            fs.writeFileSync(destination + i.replace(".html", ".json"), JSON.stringify(data));
        });
    });

};


module.exports = {parseData, parseLinks, processFiles};
