const fs = require('fs');
const dataType = require('./getDataType.js');

const data_forum_folder = "../data/data_forum/";
const data_page_folder = "../data/data_page/";

// TODO this one can be used as a base to add in the new tf-idf calculations

//TODO see about changing to intent stacks :)
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

const handle_forum = async (item, db) => {
    const res = await analyze.process_forum_item(item);
    db.addToCollection([res], 'forum');
};


const handle_block = async (item, db) => {
    const res = await analyze.process_block_item(item);
    db.addToCollection([res], 'block');

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
        // case "group": await handle_group(item, db); break;
        case "block": db.addToCollection(stack, 'block'); break;
        case "group":
            let inserted = 0;
            while (stack.length > 0 && inserted < 5){
                const item = stack.pop();
                await handle_group(item, db);
                inserted ++;
            }
            break;
    }

};


// Runs analysis on all forum objects found in the forum type directory
const runAnalysis = async (db) => {

    const stacks = init_page_stacks();
    console.log("forum list size = " + stacks.forumList.length);
    console.log("group list size = " + stacks.groupList.length);
    console.log("block list size = " + stacks.blockList.length);

    await run_stack(stacks.forumList, db, "forum");
    await run_stack(stacks.groupList, db, "group");
    await run_stack(stacks.blockList, db, "block");


};

module.exports = {runAnalysis};