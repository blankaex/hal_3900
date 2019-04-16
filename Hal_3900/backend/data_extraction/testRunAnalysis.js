const fs = require('fs');
const dataType = require('./getDataType.js');

// TO BE USED WITH NEW TF_IDF CALCULATIONS

const init_page_stacks = (data_forum_folder, data_page_folder) => {
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

const handle_group = async (group, db) => {
    // const res = await analyze.process_grouped_item(group);
    try {
        const inserted = await db.addToCollection(group.items, 'block');
        const items = Object.values(inserted.insertedIds);
        const newGroup = dataType.getGrouped(group.intent, group.courseCode, group.tags, items);
        db.addToCollection([newGroup], 'grouped');

    } catch (err) {
        console.error(err);
    }

};

const run_stack = async (stack, db, type) => {
    switch (type){
        case "forum": db.addToCollection(stack, 'forum'); break;
        case "block": db.addToCollection(stack, 'block'); break;
        case "group":
            stack.forEach(item => handle_group(item, db));
            break;
    }

};


// Runs analysis on all forum objects found in the forum type directory
const runAnalysis = async (db, data_forum_folder, data_page_folder) => {

    const stacks = init_page_stacks(data_forum_folder, data_page_folder);
    console.log("forum list size = " + stacks.forumList.length);
    console.log("group list size = " + stacks.groupList.length);
    console.log("block list size = " + stacks.blockList.length);

    await run_stack(stacks.forumList, db, "forum");
    await run_stack(stacks.groupList, db, "group");
    await run_stack(stacks.blockList, db, "block");


};

module.exports = {runAnalysis};