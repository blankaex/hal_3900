// SCRAPER MODULES
const fs = require('fs');
const rp = require('request-promise');

const process = require('./process.js');

const getPage = async (linkInfo) => {

    const myCookie = "session=.eJwljkEOwiAQRe_CuotSYWboZQidGZSorYF21Xh3UXc_L_8l7zQxV203M-_10MHEImY2ClO2SAltWJwPAp4EQmCxiHlEMoPhVnPct7uu_W8lTczql0kkOy-MtAB55y5gxSETQ9fRda88X1rbtqZdu9jBVsu1rOkRj6b1j77rF-LHQBTg_QEJIDFJ.D3MuGQ.WJ1w1MxEmd8lrrqG64XW5ZyWdgc; Domain=.webcms3.cse.unsw.edu.au; HttpOnly; Path=/"; // login session cookie

    // This fetches the html from the page specified
    const html = await rp({
        uri: linkInfo.address,
        headers: { Cookie: myCookie }
    });

    return html;
};

const scrapeForum = async (forumRoot) => {
    // GET FORUM HTML
    const linkInfo = {"address": forumRoot};
    let forumRootHtml;
    console.log("getting page root");
    try {
        forumRootHtml = await getPage(linkInfo);
    } catch (err){
        console.error(err);
    }

    // GET TOPIC PAGE LINKS FROM FORUM ROOT HTML
    // topicPages is format [{name, address, numPosts},{etc....}, {etc.....}]
    console.log("getting topic pages");
    const topicPages = process.getForumTopicPages(forumRootHtml);
    // console.log(topicPages);// TODO working up to here

    console.log("getting topic page HTMLs");
    // GET TOPIC PAGES HTMLS, GET LINKS FROM THESE TO ACTUAL QUESTION PAGES
    const topicPageLinks = topicPages.map(async (linkInfo, index) => {
        try {
            const topicPage = await getPage(linkInfo);
            return process.getForumPages(topicPage);
        } catch (err){
            console.error(err);
        }
    });

    // format of array: [{tags, addresslist},{ etc....  },{ etc...  }]
    // each array item corresponds to one of the topic listing pages.
    console.log("final page lists");

    const finalPageLists = await Promise.all(topicPageLinks);
    console.log(finalPageLists);

    // GET A POSTS OBJECT FOR EACH FORUM TOPIC
    // Posts item format = {tags: [], question: " ", answers: []}
    const forumPosts = finalPageLists.forEach(async (pageList) => {

        console.log("getting final page infos");

        const postObjects = pageList.addressList.map(async (address, index) => {

            // Get forum id from last part of URL
            const tokens = address.split("/");
            const id = tokens[tokens.length-1];
            const url = `https://webcms3.cse.unsw.edu.au/messages/?type_id=${id}&type=message&limit=100&cursor=&depth=0`;

            try {
                // const questionPage = await getPage({address});
                const apiResponse = await getPage({"address": url});
                const responseObject = JSON.parse(apiResponse);
                return process.getForumPostObject(responseObject, pageList.tags);
            } catch (err) {
                console.error(err);
            }
        });

        const posts = await Promise.all(postObjects);

        // SAVE JSON TO FILE
        fs.writeFileSync("../data_forum/" + pageList.topic.replace(/\s+/g, '-') + ".json", JSON.stringify({posts}));

    });

};

const scrapeSpecified = (fileName) => {

    // GET PAGES OBJECT FROM FILE
    const pages = require(fileName);
    // console.log(pages);

    // SCRAPE FROM LISTED
    // pages.list.forEach(page => {
    //     console.log("scraping " + page.address);
    //     getPage(page)
    //         .then(result => fs.writeFileSync("../html/" + page.name.replace(/\s+/g, '-') + ".html", result))
    //         .catch(err => console.log(err.message));
    // });

    // SCRAPE FORUM STARTING AT ROOT PAGE
    scrapeForum(pages.forum);

};

module.exports = {getPage, scrapeSpecified};