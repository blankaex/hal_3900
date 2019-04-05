const fs = require('fs');
const analyze = require('./analyze.js');
// Initialize the queues (3 types)

const init_forum_stack = (directory) => {
    const forumList = [];
    fs.readdir(directory, (err, items) => {
        // add array from each file to the forumList
        items.forEach(i => forumList.concat((require(directory + i)).posts));
    });
    return forumList;
};

// Runs analysis on all forum objects found in the forum type directory
const run_queue = async () => {
    const capPerMinute = 500; // the capped rate of queries per minute for our QUOTA is 600, keep well under this and adjust later
    const maxPerSecond = capPerMinute/60;
    // calc millisecond wait time between requests

    const stack = init_forum_stack("../data_forum");

    // TODO track num fails to adjust waiting rate

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
            return {tags, "question": item.question, "answers": item.answers};

        } catch (err) {
            // if fails, wait for a minute and retry
        }

    }

};


