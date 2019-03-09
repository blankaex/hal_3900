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

    fs.writeFileSync("output.html", html);

    return html;
   // var $ = cheerio.load(html);

   // const allTextRows = $("tr").text();
    // console.log(html);
    //return Promise.all(pageMap);
    // return allTextRows;
};

getPage().then(result => console.log(result));
