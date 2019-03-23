// SCRAPER MODULES
const fs = require('fs');
const rp = require('request-promise');

const process = require('./process.js');

const getPage = async (linkInfo) => {

    const myCookie = ""; // login session cookie

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
    try {
        forumRootHtml = await getPage(linkInfo);
    } catch (err){
        console.error(err);
    }

    // GET TOPIC PAGE LINKS FROM FORUM ROOT HTML
    // topicPages is format [{name, address, numPosts},{etc....}, {etc.....}]
    const topicPages = process.getForumTopicPages(forumRootHtml);

    // GET TOPIC PAGES HTMLS, GET LINKS FROM THESE TO ACTUAL QUESTION PAGES
    const topicPageLinks = topicPages.map(async (linkInfo, index) => {
        try {
            const topicPage = await getPage(linkInfo);

            const tokens = linkInfo.address.split("/");
            const topicPageId = tokens[tokens.length-1];

            return process.getForumPages(topicPage, topicPageId);
        } catch (err){
            console.error(err);
        }
    });

    // format of array: [{tags, addresslist},{ etc....  },{ etc...  }]
    // each array item corresponds to one of the topic listing pages.

    const finalPageLists = await Promise.all(topicPageLinks);

    // GET A POSTS OBJECT FOR EACH FORUM TOPIC
    // Posts item format = {tags: [], question: " ", answers: []}
    const forumPosts = finalPageLists.forEach(async (pageList) => {

        const postObjects = pageList.addressList.map(async (address, index) => {

            // GET FORUM POST ID FROM LAST PART OF URL
            const tokens = address.split("/");
            const id = tokens[tokens.length-1];
            // URL FOR API CALL TO DIRECTLY GET FORUM POST
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

        // GETS ARRAY OF POST OBJECTS FROM THE MAP
        const postsArray = await Promise.all(postObjects);

        // FILTER NULL RESULTS
        const posts = postsArray.filter(item => item != null);

        // SAVE JSON TO FILE
        fs.writeFileSync("../data_forum/" + pageList.topicPageId + ".json", JSON.stringify({posts}));

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