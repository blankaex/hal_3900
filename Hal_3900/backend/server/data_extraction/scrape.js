// SCRAPER MODULES
const fs = require('fs');
const rp = require('request-promise');

const process = require('./process.js');

const getPage = async (linkInfo) => {

    const myCookie = "session=.eJwljkEOwiAQRe_CuguGMhR6GcLAjBK1NdCujHcXdffz8l_yXipK435V69FOnlSsRa0KLZWFGKAgBgiIJofkZDYCopMVNancm8Rjv_E2_g68Fg9-dnkmAwSeSUQjccFEyWHOi7VohlcfT25939LBQxxgb_VSt3SPZ-f2R9_1C0EdvA_u_QErPTHG.D6f82w.sxKHJ0Qll5pyrr9IdNwPH-qmMSY; Domain=.webcms3.cse.unsw.edu.au; HttpOnly; Path=/"; // CAN SET THIS TO ACCESS FILES BEHIND A WALL.

    // This fetches the html from the page specified
    try {
        const html = await rp({
            uri: linkInfo.address,
            headers: { Cookie: myCookie }
        });

        return html;
    } catch (err){
        console.log("Couldn't read this url: " + linkInfo.address);
    }

};

// code suggestion from https://codingwithspike.wordpress.com/2018/03/10/making-settimeout-an-async-await-function/
const wait = async (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};

const scrapeForum = async (forumRoot, dest) => {
    console.log("Scraping forum posts...");
    // GET FORUM HTML
    const linkInfo = {"address": forumRoot};
    let forumRootHtml;
    try {
        forumRootHtml = await getPage(linkInfo);
    } catch (err){
        // console.error(err);
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
    await wait(4000);

    // GET A POSTS OBJECT FOR EACH FORUM TOPIC, STORE TO FILESYSTEM AS JSON
    const res = finalPageLists.map(async (pageList) => {

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
                let intent = "content";
                if (pageList.tags.filter(tag => tag.name === "assignments")){
                    intent = "assignments";
                } else if (pageList.tags.filter(tag => tag.name === "course outline")){
                    intent = "outline";
                }
                return process.getForumPostObject(responseObject, pageList.tags, intent);
            } catch (err) {
                console.error(err);
            }
        });

        // GETS ARRAY OF POST OBJECTS FROM THE MAP
        const postsArray = await Promise.all(postObjects);

        // FILTER NULL RESULTS AND POSTS WITH 0 ANSWERS
        const posts = postsArray.filter(item => item != null && item.answers.length > 0);

        // SAVE JSON TO FILE
        return posts;
        // fs.writeFileSync(dest + pageList.topicPageId + ".json", JSON.stringify({posts}));

    });

    // get array of arrays
    const allRes = await Promise.all(res);

    // console.log(allRes.length);
    // flatten arrays
    let forumData = [];
    allRes.forEach(array => forumData = forumData.concat(array));

    // console.log(forumData.length);

    fs.writeFileSync(`${dest}forumData.json`, JSON.stringify({forumData}))
    return forumData;
};

const scrapeList = async (list, dest) => {
    console.log("Scraping Content Pages...");
    const resMap = await list.map(async (page) => {
        // console.log("scraping " + page.address);
        const html = await getPage(page);
        return await process.parseData(html); // returns array of text
     });

    // get array of arrays:
    const allRes = await Promise.all(resMap);

    // flatten arrays
    let pageData = [];
    allRes.forEach(array => pageData = pageData.concat(array));

    // console.log(pageData.length);

    fs.writeFileSync(`${dest}pageData.json`, JSON.stringify({ pageData }));
    return pageData;
};

const scrapeSpecified = async (pages, data_folder) => {
    // SCRAPE FROM LISTED INTENTS
    const listToScrape = pages.outline.concat(pages.assignment).concat(pages.content);
    const pageData = await scrapeList(listToScrape, data_folder)

    // SCRAPE FORUM STARTING AT ROOT PAGE
    const forumData = await scrapeForum(pages.forum, data_folder);

    // WAIT UNTIL ALL COMPLETED BEFORE RETURNING
    // await Promise.all([pageData, forumData]);
    return { pageData, forumData };
};

module.exports = {scrapeSpecified};