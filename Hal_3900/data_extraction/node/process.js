// SCRAPER MODULES
const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');


const stripText = (text) => {
    // strip html tags
    let newText = text.replace(/<(?:.|\n)*?>/gm, '');
    // strip non-alphanumeric, replace with space
    newText = newText.replace(/[\W_]+/g," ");
    // remove excess whitespace
    newText = newText.replace(/\s+/g, ' ');
    // tolower() and trim start/end whitespace
    newText = newText.toLowerCase().trim();

    return newText;

};

const getTag = (name) => {
    const salience = 0.5;
    const theta = 1;
    return {name, salience, theta};
};

const parseData = (html) => {

    let $ = cheerio.load(html);

    // GET ALL TABLES DATA
    const grouped = [];
    $("table").each((index, element) => {
        const items = [];
        const tags = [];
        tags.push(getTag("table"));
        const prev = $(element).prev();
        if (prev.is("h1") ||  prev.is("h2") || prev.is("h3")
            || prev.is("h4") || prev.is("h5") || prev.is("h6")){
            const name = stripText(prev.text());
            tags.push(getTag(name));
        }
        $(element).find("tr").map((i, e) => {
            // get the tablerow text, strip whitespace to singles
            const td = [];
            $(e).find("td").map((i, e) => {
                td.push($(e).text());
            });
            const text = stripText(td.toString());
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
        tags.push(getTag("list"));
        const prev = $(element).prev();
        if (prev.is("h1") ||  prev.is("h2") || prev.is("h3")
            || prev.is("h4") || prev.is("h5") || prev.is("h6")){
            const name = stripText(prev.text());
            tags.push(getTag(name));
        }
        $(element).find("li").each((i, e) => {
            // paragraph with stripped whitespace. could break them up further if needed
            const text = stripText($(e).text());
            const tags = []; // these tags will extract from data
            items.push({tags, text});
        });
        grouped.push({tags, items});
    });

    // GET ALL PARAGRAPHS DATA
    const block = [];
    $("p").map((index, element) => {
        const tags = [];
        tags.push(getTag("paragraph"));
        const prev = $(element).prev();
        if (prev.is("h1") ||  prev.is("h2") || prev.is("h3")
            || prev.is("h4") || prev.is("h5") || prev.is("h6")){
            const name = stripText(prev.text());
            tags.push(getTag(name));
        }
        // paragraph with stripped whitespace. could break them up further if needed
        const text = stripText($(element).text());

        if (text){ // text is not falsy value or "",
            block.push({tags, text});
        }
    });

    return {grouped, block};

};

// feed me the html for the root forum page
const getForumTopicPages = (forumRootHtml) => {
    // array of each item to be {topic name, url}

    //TODO refactor to use Promise.all() to create array
    const topicPages = [];
    const baseURL = "https://webcms3.cse.unsw.edu.au";

    let $ = cheerio.load(forumRootHtml);

    $("tr").map((index, element) => {
        const address = baseURL + $(element).find("td").eq(0).find("a").attr("href");
        const name = $(element).find("td").eq(0).text().replace(/\s+/g, ' ').replace(":", "/");  // TODO why is this replacing : with / ???
        const numPosts = stripText($(element).find("td").eq(1).text());
            if (parseInt(numPosts) !== 0 && name !== ""
                && !name.includes("Tutor's Weekly") && !name.includes("Tutor Group") ){
                topicPages.push({name, address, numPosts});
            }
    });
    return topicPages;
};

// feed me html object for a topic listing page
// returns list of links from this topic page
const getForumPages = (html, topicPageId) => {

    const baseURL = "https://webcms3.cse.unsw.edu.au";

    let $ = cheerio.load(html);
    const addressList = [];
    const tags = [];
    // Get each <tr>
    $("tr").map((index, element) =>{
        // get its first <td>
        // get the a.href within that, this is the link
        const address = baseURL + $(element).find("td").eq(0).find("a").attr("href");
        // console.log(address);  // TODO some of these addresses are finding undefined
        addressList.push(address);
    });

    $(".breadcrumb").find("li").map((index, element) => {
        const name = stripText($(element).text());
        tags.push(getTag(name));
    });

    return {tags, topicPageId, addressList};
};

const extractMessage = (messageItem) => {
    const text = stripText(messageItem.body);
    const childResults = [];
    childResults.push(text);
    messageItem.children.forEach(child => {
        childResults.push(extractMessage(child));
    });
    return childResults;
};

const getForumPostObject = (apiResponseObject, tags) => {

    // console.log("getting forum post object");
    // TODO catch error thrown here on some objects: TypeError: cannot read property '0' of undefined
    const question = stripText(apiResponseObject.result.messages[0].body);
    const answers = [];
    apiResponseObject.result.messages[0].children.forEach(child => {
        const results = extractMessage(child);
        results.forEach(result => {
            if (result != null){
                answers.push(result);
            }
        });
    });

    return {tags, question, answers};
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

module.exports = {parseData, processFiles, getForumTopicPages, getForumPages, getForumPostObject};
