const fs = require('fs');
const analyze = require('./analyze.js');
const dataType = require('./getDataType.js');

const data_forum_folder = "../data/data_forum/";
const data_page_folder = "../data/data_page/";

// Initialize the queues (3 types)

const init_page_stacks = () => {
    let forumList = [];        // add array from each file to the forumList
    let groupList = [];        // add array from each file to the forumList
    let blockList = [];        // add array from each file to the forumList

    fs.readdirSync(data_forum_folder).forEach(i => {
        forumList = forumList.concat((require("../" + data_forum_folder + i)).posts);
    });
    fs.readdirSync(data_page_folder).forEach(i => {
        const file = require("../" + data_page_folder + i);
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


const handle_forum = async (item, db) => {
    const res = await analyze.process_forum_item(item);
    db.addToCollection([res], 'forum');
};


const handle_block = async (item, db) => {
    const res = await analyze.process_block_item(item);
    db.addToCollection([res], 'block');

};

const handle_group = async (group, db) => {
    const res = await analyze.process_grouped_item(group);
    try {
        const inserted = db.addToCollection(res.items, 'block');
        console.log(inserted);
        const newGroup = dataType.getGrouped(res.intent, res.courseCode, res.tags, inserted.insertedIds);
        db.addToCollection([newGroup], 'grouped');
    } catch (err) {
        console.error(err);
    }

};

const run_stack = async (stack, millisecWaitTime, db, type) => {
    let numQuotaErrs = 0;
    while (stack.length > 0){
        const item = stack.pop();
        try {
            switch (type){
                case "forum": await handle_forum(item, db); break;
                case "group": await handle_group(item, db); break;
                case "block": await handle_block(item, db); break;
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

// Runs analysis on all forum objects found in the forum type directory
const runAnalysis = async (db) => {
    const capPerMinute = 500; // the capped rate of queries per minute for our QUOTA is 600, keep well under this and adjust later
    let millisecWaitTime = 60000 / capPerMinute; // calc millisecond wait time between requests

    const stacks = init_page_stacks();
    console.log("forum list size = " + stacks.forumList.length);
    console.log("group list size = " + stacks.groupList.length);
    console.log("block list size = " + stacks.blockList.length);

    const forumErrs = await run_stack(stacks.forumList, millisecWaitTime, db, "forum");
    const groupErrs = await run_stack(stacks.groupList, millisecWaitTime, db, "group");
    const blockErrs = await run_stack(stacks.blockList, millisecWaitTime, db, "block");

    const total = forumErrs + groupErrs + blockErrs;
    console.log("finished with " + total + " errs");
};

module.exports = {runAnalysis};




