const fs = require('fs');
const analyze = require('./analyze.js');
const db = require('../db.js');
const dataType = require('./getDataType.js');

const data_forum_folder = "../data/data_forum/";
const data_page_folder = "../data/data_page/";

// Initialize the queues (3 types)

const init_page_stacks = () => {
    let forumList = [];        // add array from each file to the forumList
    let groupList = [];        // add array from each file to the forumList
    let blockList = [];        // add array from each file to the forumList

    fs.readdirSync(data_forum_folder).forEach(i => {
        forumList = forumList.concat((require(data_forum_folder + i)).posts);
    });
    fs.readdirSync(data_page_folder).forEach(i => {
        const file = require(data_page_folder + i);
        groupList = groupList.concat(file.grouped);
        blockList = blockList.concat(file.block);
    });


    return {forumList, groupList, blockList};
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
    let millisecWaitTime = 60000 / capPerMinute; // calc millisecond wait time between requests

    const stacks = init_page_stacks();
    console.log("forum list size = " + stacks.forumList.length);
    console.log("group list size = " + stacks.groupList.length);
    console.log("block list size = " + stacks.blockList.length);

    // const forumErrs = await run_forum(stacks.forumList, millisecWaitTime, "forum");
    // const groupErrs = await run_forum(stacks.groupList, millisecWaitTime, "group");
    const blockErrs = await run_forum(stacks.blockList, millisecWaitTime, "block");

    // TODO run_block and run_queue, test against whole course data load, adjust params to speed up

    const total = forumErrs + groupErrs + blockErrs;
    console.log("finished with " + total + " errs");
};

const handle_forum = async (item) => {
    const res = await analyze.process_forum_item(item);

    // TODO for now, print the object, just a test
    console.log(res);
    // TODO database insert to forum
};

const handle_block = async (item) => {
    const res = await analyze.process_block_item(item);

    // TODO for now, print the object, just a test
    console.log(res);
    // TODO database insert to block
};

const handle_group = async (group) => {
    const res = await analyze.process_grouped_item(group);

    // TODO for now, print the object, just a test
    console.log(res);
    // TODO database insert to group, handle change in group data structure
    // https://stackoverflow.com/questions/14481521/get-the-id-of-inserted-document-in-mongo-database-in-nodejs
};

const run_forum = async (stack, millisecWaitTime, type) => {
    let numQuotaErrs = 0;
    while (stack.length > 0){
        const item = stack.pop();
        try {
            switch (type){
                case "forum": await handle_forum(item); break;
                case "group": await handle_group(item); break;
                case "block": await handle_block(item); break;
            }
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




