// SCRAPER MODULES
const fs = require('fs');
const rp = require('request-promise');

const process = require('./process.js');

const getPage = async (linkInfo) => {

    const myCookie = "session=.eJwljs0OwiAQhN9lzz0sPwulL0Mo7CpRWwPtyfjuot4mX-abzAuiNO5XWI528gSxFliA7Fr8ykoVoqACkc4hOTFalGCyAhPk3iQe-4230XcGMWc0aNmyIjtn0TqZkrLBEcZK8c6LGV59PLn1fUsHD3GAvdVL3dI9np3bH33T7whhmOfg3h8K_TFU.D5dVgg.xZz7kxoJKsO8r_t4ThYMx4kyD4s; Domain=.webcms3.cse.unsw.edu.au; HttpOnly; Path=/"; // CAN SET THIS TO ACCESS FILES BEHIND A WALL.

    // This fetches the html from the page specified
    const html = await rp({
        uri: linkInfo.address,
        headers: { Cookie: myCookie }
    });

    return html;
};

// code suggestion from https://codingwithspike.wordpress.com/2018/03/10/making-settimeout-an-async-await-function/
const wait = async (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};

const scrapeForum = async (forumRoot, courseCode, dest) => {

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
                return process.getForumPostObject(responseObject, pageList.tags, intent, courseCode);
            } catch (err) {
                console.error(err);
            }
        });

        // GETS ARRAY OF POST OBJECTS FROM THE MAP
        const postsArray = await Promise.all(postObjects);

        // FILTER NULL RESULTS AND POSTS WITH 0 ANSWERS
        const posts = postsArray.filter(item => item != null && item.answers.length > 0);


        // SAVE JSON TO FILE
        fs.writeFileSync(dest + pageList.topicPageId + ".json", JSON.stringify({posts}));

    });
    await Promise.all(res);
};

const scrapeList = async (list, intent, courseCode, dest) => {
    const res = list.map(async (page) => {
        console.log("scraping " + page.address);
        const html = await getPage(page);
        const data = await process.parseData(html, intent, courseCode);
        // WRITE JSON OBJECTS TO FILE
        fs.writeFileSync(dest + page.name.replace(/\s+/g, '-') + ".json", JSON.stringify(data));
    });

    await Promise.all(res);
};

const scrapeSpecified = async (pages, data_forum_folder, data_page_folder) => {

    // SCRAPE FROM LISTED INTENTS
    const outlineRes = await scrapeList(pages.outline, "outline", pages.courseCode, data_page_folder)
    await wait(2000);
    const assignmentRes = await scrapeList(pages.assignment, "assignment", pages.courseCode, data_page_folder);
    await wait(2000);
    const contentRes = await scrapeList(pages.content, "content", pages.courseCode, data_page_folder);
    await wait(2000);

    // SCRAPE FORUM STARTING AT ROOT PAGE
    const forumRes = scrapeForum(pages.forum, pages.courseCode, data_forum_folder);

    await Promise.all([outlineRes, assignmentRes, contentRes, forumRes]);
};

module.exports = {scrapeSpecified};