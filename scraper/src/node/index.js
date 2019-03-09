// this page is the entry point

// require modules
const fs = require('fs');

const rp = require('request-promise');
const otcsv = require('objects-to-csv');
const cheerio = require('cheerio');

const baseURL = 'https://webcms3.cse.unsw.edu.au/COMP1521/18s2/';
const outlineURL = 'outline';

const getPage = async () => {

    const html = await rp(baseURL + outlineURL);

    var $ = cheerio.load(html);

    // BASIC GET INSTANCES OF TAG TO SINGLE TEXT
    // const allTextRows = $("tr").text();
    // const allParagraphs = $("p").text();

    // get array of tables: each table is array of tablerows' text
    const allTables = [];
    $("table").map((index, element)=> {
        // TODO ideally we want the table's name/heading too.
        const id = "table" + index;
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

    // test it by printing :)
    let stream = fs.createWriteStream("outline.json", {flags:'a'});

    allTables.forEach((t)=> {
        stream.write(JSON.stringify(t) + "\n");
        t.tableRows.forEach((r)=> {
            console.log(r);
        });
        console.log("");
    });

    // each element is a table row: .text gets it to text
    // $("tr").map((index, element)=> {
    //     allTableRows.push($(element).text().replace(/\s+/g,' '));
    // });

    // fs.writeFileSync("outline.txt", allTextRows);
    // fs.writeFileSync("outline.txt", allParagraphs);

    return allTables;
};
getPage();
// getPage().then(result => console.log(result.replace(/\s+/g,' ')));
