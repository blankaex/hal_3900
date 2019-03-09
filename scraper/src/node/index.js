// require modules
const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');

const baseURL = 'https://webcms3.cse.unsw.edu.au/COMP1521/18s2/';
const outlineURL = 'outline';

const getPageData = async () => {
    const html = await rp(baseURL + outlineURL);
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
    const name = "course-outline";
    return {name, allTables, allParagraphs};
};

getPageData().then(result => {
    fs.writeFileSync(result.name + ".json", JSON.stringify(result));
});
