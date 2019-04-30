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

const getBlock = (intent, courseCode, type, tags, text) => {
    return {intent, courseCode, type, tags, text};
};

// takes grouped data object, returns array of block data
// one block with all text, then one block for each grouped item
const getGrouped = (items) => {
    let jointText;
    try {
        jointText = items.join("\n");
    } catch (err) {

    }

    if (jointText) return items.concat(jointText);
    else return items;
};

const getForumObject = (question, answers) => {
    return {question, answers};
};

const getQuizObject = (courseCode, question, answer, tags=[]) => {
    return {courseCode, question, answer, tags};
};

const getCourse = (courseCode, courseName) => {
    return {courseCode, courseName};
};

module.exports = {getTag, getAnswer, getBlock, getGrouped, getForumObject, getQuizObject, getCourse};