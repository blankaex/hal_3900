// SCRAPER MODULES
const fs = require('fs');
const rp = require('request-promise');

const getPage = async (linkInfo) => {

    const myCookie = ""; // login session cookie

    // This fetches the html from the page specified
    const html = await rp({
        uri: linkInfo.address,
        headers: { Cookie: myCookie }
    });

    return html;
};

const scrapeSpecified = (fileName) => {
    // GET PAGES OBJECT FROM FILE
    const pages = require(fileName);
    console.log(pages);
    pages.list.forEach(page => {
        console.log("scraping " + page.address);
        getPage(page)
            .then(result => fs.writeFileSync("../html/" + page.name.replace(/\s+/g, '-') + ".html", result))
            .catch(err => console.log(err.message));
    });
};

module.exports = {getPage, scrapeSpecified};