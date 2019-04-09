const fs = require('fs');
const analyze = require('./analyze.js');
const db = require('../db.js');
const dataType = require('./getDataType.js');

const data_forum_folder = "../data/data_forum/";
const data_page_folder = "../data/data_page/";

// Initialize the queues (3 types)

const init_forum_stack = (directory) => {
    let forumList = [];        // add array from each file to the forumList
    fs.readdirSync(directory).forEach(i => {
        forumList = forumList.concat((require(directory + i)).posts);
    });
    return forumList;
};

// code suggestion from https://codingwithspike.wordpress.com/2018/03/10/making-settimeout-an-async-await-function/
const wait = async (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};


// Runs analysis on all forum objects found in the forum type directory
const run_queue = () => {
    const capPerMinute = 500; // the capped rate of queries per minute for our QUOTA is 600, keep well under this and adjust later
    let millisecWaitTime = 60000 / capPerMinute; // calc millisecond wait time between requests

    const stack = init_forum_stack(data_forum_folder);
    console.log("list size = " + stack.length);

    run_forum(stack, millisecWaitTime);
};

const run_forum = async (stack, millisecWaitTime) => {
    let numQuotaErrs = 0;
    while (stack.length > 0){
        // pop item
        const item = stack.pop();
        // run analysis
        let newTags;
        try {
            newTags = await analyze.getNewTags(item.question); // question is the forum text we've been analyzing

            // if success, add tags to the item and send to the DB
            const res = dataType.getForumObject(item.intent, item.courseCode, item.tags.concat(newTags), item.question, item.answers);

            // TODO for now, print the object, just a test

            console.log(res);
            // TODO database insert    https://stackoverflow.com/questions/14481521/get-the-id-of-inserted-document-in-mongo-database-in-nodejs

            await wait(millisecWaitTime);  // short wait to space out API calls

        } catch (err) {
            console.log(err);
            stack.push(item);             // put back on stack
            millisecWaitTime += 10;       // increase wait time per item
            numQuotaErrs ++;              // count up quota exceeds
            await(60000)                  // wait for 1 minute before restarting
        }

    }
    return numQuotaErrs;
};

module.exports = {run_queue};




