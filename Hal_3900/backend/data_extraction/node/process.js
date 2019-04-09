const fs = require('fs');
const cheerio = require('cheerio');
const dataType = require('./getDataType.js');


const stripText = (text) => {
    let newText = text.replace(/<(?:.|\n)*?>/gm, '');   // strip html tags
    newText = newText.replace(/[\W_]+/g," ");           // strip non-alphanumeric, replace with space
    newText = newText.replace(/\s+/g, ' ');             // remove excess whitespace
    newText = newText.toLowerCase().trim();             // tolower() and trim start/end whitespace
    return newText;
};

const parseData = (html, intent, courseCode) => {
    let $ = cheerio.load(html);

    // GET ALL TABLES DATA
    const grouped = [];
    $("table").each((index, element) => {
        const items = [];
        const tags = [];
        tags.push(dataType.getTag("table"));
        const prev = $(element).prev();
        if (prev.is("h1") ||  prev.is("h2") || prev.is("h3")
            || prev.is("h4") || prev.is("h5") || prev.is("h6")){
            const name = stripText(prev.text());
            tags.push(dataType.getTag(name));
        }
        $(element).find("tr").map((i, e) => {
            // get the tablerow text, strip whitespace to singles
            const td = [];
            $(e).find("td").map((i, e) => {
                td.push($(e).text());
            });
            const text = stripText(td.toString());
            // construct js object
            items.push(dataType.getBlock(intent, courseCode, [], text));
        });
        grouped.push(dataType.getGrouped(intent, courseCode, tags, items));
    });

    // GET ALL LIST DATA
    $("ul").map((index, element) => {
        let items = [];
        const tags = [];
        tags.push(dataType.getTag("list"));
        const prev = $(element).prev();
        if (prev.is("h1") ||  prev.is("h2") || prev.is("h3")
            || prev.is("h4") || prev.is("h5") || prev.is("h6")){
            const name = stripText(prev.text());
            tags.push(dataType.getTag(name));
        }
        $(element).find("li").each((i, e) => {
            // paragraph with stripped whitespace. could break them up further if needed
            const text = stripText($(e).text());
            items.push(dataType.getBlock(intent, courseCode, [], text));
        });
        grouped.push(dataType.getGrouped(intent, courseCode, tags, items));
    });

    // GET ALL PARAGRAPHS DATA
    const block = [];
    $("p").map((index, element) => {
        const tags = [];
        tags.push(dataType.getTag("paragraph"));
        const prev = $(element).prev();
        if (prev.is("h1") ||  prev.is("h2") || prev.is("h3")
            || prev.is("h4") || prev.is("h5") || prev.is("h6")){
            const name = stripText(prev.text());
            tags.push(dataType.getTag(name));
        }
        // paragraph with stripped whitespace. could break them up further if needed
        const text = stripText($(element).text());

        if (text){ // text is not falsy value or "",
            block.push(dataType.getBlock(intent, courseCode, tags, text));
        }
    });

    return {grouped, block};

};

// feed me the html for the root forum page
// returns array where each item to be {topic name, url}
const getForumTopicPages = (forumRootHtml) => {

    const topicPages = [];
    const baseURL = "https://webcms3.cse.unsw.edu.au";

    let $ = cheerio.load(forumRootHtml);

    $("tr").map((index, element) => {
        const address = baseURL + $(element).find("td").eq(0).find("a").attr("href");
        const name = $(element).find("td").eq(0).text().replace(/\s+/g, ' ').replace(":", "/");
        const numPosts = stripText($(element).find("td").eq(1).text());
            if (parseInt(numPosts) !== 0 && name !== ""
                && !name.includes("Tutor's Weekly") && !name.includes("Tutor Group") ){
                topicPages.push({name, address});
            }
    });
    return topicPages;
};

// feed me html object for a topic listing page
// returns list of links from this topic page to
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
        addressList.push(address);
    });

    $(".breadcrumb").find("li").map((index, element) => {
        const name = stripText($(element).text());
        tags.push(dataType.getTag(name));
    });

    return {tags, topicPageId, addressList};
};

const extractMessage = (messageItem) => {
    const text = stripText(messageItem.body);
    const childResults = [];

    // get the text from THIS message
    childResults.push(dataType.getAnswer(text));

    // also add the results from all children of this message (recurse)
    messageItem.children.forEach(child => {
        childResults.push(extractMessage(child));
    });

    return childResults;
};

const getForumPostObject = (apiResponseObject, tags, intent, courseCode) => {

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

    return dataType.getForumObject(intent, courseCode, tags, question, answers);
};


module.exports = {parseData, getForumTopicPages, getForumPages, getForumPostObject};
