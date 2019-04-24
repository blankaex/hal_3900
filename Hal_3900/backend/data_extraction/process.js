const cheerio = require('cheerio');
const dataType = require('./getDataType.js');


const stripText = (text) => {
    let newText = text.replace(/<small>(.*?)<\/small>/gm, ' ');  // strip <small></small> and anything in between
    newText = newText.replace(/<(?:.|\n)*?>/gm, ' ');            // strip html tags
    newText = newText.replace(/[^a-z0-9'/$\-._ ]/gi, ' ');    // strip certain non-alphanumeric, leave punctuation, replace with space
    // newText = text.replace(/[\W_]+/g, ' ');                      // strip ALL non-alphanumeric, replace with space
    newText = newText.replace(/\s+/g, ' ');                      // remove excess whitespace
    newText = newText.toLowerCase().trim();                      // tolower() and trim start/end whitespace
    return newText;
};

const parseData = (html) => {

    const tableData = getTableData(html);
    const listData = getListData(html);
    const paragraphData = getParagraphData(html);

    // get out all the blocks together in array
    const data = tableData.concat(listData).concat(paragraphData);

    return data;
};

// HELPER FUNCTIONS FOR PARSING DATA PAGES

const getTableData = (html) => {
    // load cheerio library
    let $ = cheerio.load(html);

    const tableData = [];
    $("table").each((index, element) => {
        let items = $(element).find("tr").map((i, e) => {
            // get the tablerow text, strip whitespace to singles
            const td = [];
            $(e).find("td").map((i, e) => {
                td.push(stripText($(e).text()));
            });
            return td.join(', ');
        });

        items = items.filter(i => i !== "" && i !== null);

        if (items.length > 0) {
            Array.prototype.push.apply(tableData, dataType.getGrouped(items));
        }
    });

    return tableData;
};

const getListData = (html) => {
    // load cheerio library
    let $ = cheerio.load(html);

    let listData = [];
    $("ul").map((index, element) => {
        let items = [];
        $(element).find("li").each((i, e) => {
            // paragraph with stripped whitespace. could break them up further if needed
            const text = stripText($(e).text());
            if (text) {
                items.push(text);
            }
        });
        if (items.length > 0){
            Array.prototype.push.apply(listData, dataType.getGrouped(items));
        }
    });
    return listData;
};

const getParagraphData = (html) => {
    // load cheerio library
    let $ = cheerio.load(html);

    const paragraphData = [];
    $("p").map((index, element) => {
        const text = stripText($(element).text());
        if (text){ // text is not falsy value or "",
            paragraphData.push(text);
        }
    });
    return paragraphData;
};


// FUNCTIONS FOR PARSING FORUM PAGES

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

// FUNCTIONS FOR GETTING FINAL DATA FROM FORUM

const extractMessage = (messageItem) => {
    const text = stripText(messageItem.body);
    const childResults = [];

    // get the text from THIS message
    childResults.push(dataType.getAnswer(text));

    // also add the results from all children of this message (recurse)
    messageItem.children.forEach(child => {
        Array.prototype.push.apply(childResults, extractMessage(child));
    });

    return childResults;
};

const getForumPostObject = (apiResponseObject) => {

    try {
        const question = stripText(apiResponseObject.result.messages[0].body);
        const answers = [];
        apiResponseObject.result.messages[0].children.forEach(child => {
            const results = extractMessage(child);
            results.forEach(result => {
                if
                (result != null){
                    Array.prototype.push.apply(answers.push(result));
                }
            });
        });
        return dataType.getForumObject(question, answers);
    } catch (err){
        // console.log("Item not available")
    }
};


module.exports = {parseData, getForumTopicPages, getForumPages, getForumPostObject};
