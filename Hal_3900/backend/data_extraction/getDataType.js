// Use to enforce our data structures across the code base

const getTag = (name, salience = 0.5) => {
    const theta = 1;
    return {name, salience, theta};
};

const getAnswer = (text) => {
    const theta = 1;
    const count = 0;
    return {text, theta, count}
};

const getBlock = (intent, courseCode, tags, text) => {
    return {intent, courseCode, tags, text};
};

const getGrouped = (intent, courseCode, tags, items) => {
    return {intent, courseCode, tags, items};
};

const getForumObject = (intent, courseCode, tags, question, answers) => {
    return {intent, courseCode, tags, question, answers};
};

const getQuizObject = (id, question, answer, tags=[]) => {
    return {id, question, answer, tags};
};

module.exports = {getTag, getAnswer, getBlock, getGrouped, getForumObject, getQuizObject};