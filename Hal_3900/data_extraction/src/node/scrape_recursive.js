const fs = require('fs');
const rp = require('request-promise');

const baseURL = 'https://webcms3.cse.unsw.edu.au/';

// SET YOUR SESSION COOKIE HERE FOR LOGIN REQ PAGES
const myCookie = "";

let seenSet = new Set();

const recursiveDataScrape = async (linkInfo) => {

    // TODO this function may not be best approach, may not use

    // ensure we don't scrape each page more than once.
    if (seenSet.has(linkInfo.linkURL)) {
        return;
    } else {
        seenSet.add(linkInfo.linkURL);
    }

    // TODO: set your session cookie as global up top. Don't push it to github.
    // This fetches the html from the page specified
    const html = await rp({
        uri: baseURL + linkInfo.linkURL,
        headers: { Cookie: myCookie }
    });

    const allLinks = parseLinks(html);
    // WRITE OUT TO JSON
    const name = linkInfo.title.replace(/\s+/g, '-');

    const results = html;

    for (let i = 0; i < allLinks.length; i++) {
        getPageData(allLinks[i])
            .then(result =>
                fs.writeFileSync("src///html///" + name + ".html", html))
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