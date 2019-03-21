// SCRAPER MODULES
const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');

const parseData = (html) => {

    let $ = cheerio.load(html);

    // GET ALL TABLES DATA
    const grouped = [];
    $("table").each((index, element) => {
        const items = [];
        const tags = [];
        tags.push({"name":"table"});
        const prev = $(element).prev();
        if (prev.is("h1") ||  prev.is("h2") || prev.is("h3")
            || prev.is("h4") || prev.is("h5") || prev.is("h6")){
            const name = prev.text().replace(/\s+/g, ' ');
            tags.push({name});
        }
        $(element).find("tr").map((i, e) => {
            // get the tablerow text, strip whitespace to singles
            const text = $(e).text().replace(/\s+/g, ' ');
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
        tags.push({"name" : "list"});
        const prev = $(element).prev();
        if (prev.is("h1") ||  prev.is("h2") || prev.is("h3")
            || prev.is("h4") || prev.is("h5") || prev.is("h6")){
            const name = prev.text().replace(/\s+/g, ' ');
            tags.push({name});
        }
        $(element).find("li").each((i, e) => {
            // paragraph with stripped whitespace. could break them up further if needed
            const text = $(e).text().replace(/\s+/g, ' ');
            const tags = []; // these tags will extract from data
            items.push({tags, text});
        });
        grouped.push({tags, items});
    });

    // GET ALL PARAGRAPHS DATA
    const block = [];
    $("p").map((index, element) => {
        const tags = [];
        tags.push({"name" : "paragraph"});
        const prev = $(element).prev();
        if (prev.is("h1") ||  prev.is("h2") || prev.is("h3")
            || prev.is("h4") || prev.is("h5") || prev.is("h6")){
            const name = prev.text().replace(/\s+/g, ' ');
            tags.push({name});
        }
        // paragraph with stripped whitespace. could break them up further if needed
        const text = $(element).text().replace(/\s+/g, ' ');
        block.push({tags, text});
    });

    return {grouped, block};

};

// GET ALL LINKS FROM PAGE
const parseLinks = (html) => {
    const allLinks = [];

    let $ = cheerio.load(html);

    $("a").map((index, element) => {
        const link = $(element).attr("href");
        if (link.toString().startsWith("/COMP1521/18s2/")
            && !link.toString().includes("groups/")
            && !link.toString().includes("admin/")
            && !link.toString().includes("classes/")) {
            allLinks.push({
                title: $(element).text(),
                linkURL: $(element).attr("href").toString()
            });
        }
    });
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
        const name = $(element).find("td").eq(0).text().replace(/\s+/g, ' ').replace(":", "/");
        const numPosts = $(element).find("td").eq(1).text().replace(/\s+/g, ' ');
            if (parseInt(numPosts) !== 0 && name !== ""){
                topicPages.push({name, address, numPosts});
            }
    });
    return topicPages;
};

// feed me html object for a topic listing page
const getForumPages = (html) => {
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
        tags.push({"name": $(element).text().replace(/\s+/g, ' ')});
    });

    const topic = $(".active").text().replace(/\s+/g, ' ');

    return {tags, topic, addressList};
};

const extractMessage = (messageItem) => {
    const text = messageItem.body.replace(/<(?:.|\n)*?>/gm, '').replace(/\s+/g, ' ');
    console.log(text);
    const childResults = [];
    childResults.push(text);
    messageItem.children.forEach(child => {
        console.log("Exctracting child");
        childResults.push(extractMessage(child));
    });
    console.log(childResults);
    return childResults;
};

const getForumPostObject = (apiResponseObject, tags) => {

    // console.log("getting forum post object");
    const question = apiResponseObject.result.messages[0].body.replace(/<(?:.|\n)*?>/gm, '').replace(/\s+/g, ' ');
    const answers = [];
    apiResponseObject.result.messages[0].children.forEach(child => {
        const results = extractMessage(child);
        results.forEach(result => {
            answers.push(result);
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


module.exports = {parseData, parseLinks, processFiles, getForumTopicPages, getForumPages, getForumPostObject};
