// Use to enforce our data structures across the code base

const getTag = (name, salience = 0.5) => {
    const theta = salience;
    return {name, salience, theta};
};

const getAnswer = (text) => {
    const theta = 1;
    const count = 0;
    return {text, theta, count}
};

const getBlock = (courseCode, tags, text) => {
    return {courseCode, tags, text};
};

// takes grouped data object, returns array of block data
// one block with all text, then one block for each grouped item
const getGrouped = (courseCode, tags, items) => {
    let result = items;
    const allStrings = items.map(i => i.text);
    const text = allStrings.join("\n");
    result.push(getBlock(courseCode, tags, text));
    return result;
};

const getForumObject = (courseCode, tags, question, answers) => {
    return {courseCode, tags, question, answers};
};

const getQuizObject = (id, question, answer, tags=[]) => {
    return {id, question, answer, tags};
};

module.exports = {getTag, getAnswer, getBlock, getGrouped, getForumObject, getQuizObject};