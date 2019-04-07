const fs = require('fs');
const analyze = require('./analyze.js');

// TODO... CAN I IMPORT DB FUNCTIONS HERE?

// Initialize the queues (3 types)

const init_forum_stack = (directory) => {
    const forumList = [];
    fs.readdir(directory, (err, items) => {
        // add array from each file to the forumList
        items.forEach(i => forumList.concat((require(directory + i)).posts));
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
const run_queue = async () => {
    const capPerMinute = 500; // the capped rate of queries per minute for our QUOTA is 600, keep well under this and adjust later

    // calc millisecond wait time between requests
    let millisecWaitTime = 60000 / capPerMinute;

    let numQuotaErrs = 0;

    const stack = init_forum_stack("../data_forum");

    while (stack.length > 0){
        // pop item
        const item = stack.pop();
        // run analysis
        // TODO maybe make this a function to pass in whole forum object
        let newTags;
        try {
            newTags = await analyze.getNewTags(item.question); // question is the forum text we've been analyzing

            // if success, add tags to the item and send to the DB
            const tags = item.tags.concat(newTags);
            const res = {tags, "question": item.question, "answers": item.answers};

            // TODO database insert    https://stackoverflow.com/questions/14481521/get-the-id-of-inserted-document-in-mongo-database-in-nodejs

            await wait(millisecWaitTime);  // short wait to space out API calls

        } catch (err) {
            stack.push(item);             // put back on stack
            millisecWaitTime += 10;       // increase wait time per item
            numQuotaErrs ++;              // count up quota exceeds
            await(60000)                  // wait for 1 minute before restarting
        }

    }

};




