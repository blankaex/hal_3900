const uuid = require('uuid');
const express = require('express');
const router = express.Router();
const DB = require('../../db');
const db = new DB();
const data_extraction = require('../../data_extraction/data_extraction.js');

// get all quiz questions by course code
router.post('/', async (req, res) => {
    if (!db.connected)
        await db.connect()

    // console.log(req.body);

    let result;
    if (req.body.courseCode){
        result = await db.search({courseCode: req.body.courseCode}, 'quiz');
    } else {
        result = await db.search({}, 'quiz');
    }

    res.status(200).json(result);
});

// get a specific question by id
router.get('/:id', async (req, res) => {
    if (!db.connected)
        await db.connect();

    // TODO: optional heuristic stuff based on user stats
    const query = { id: { $eq: req.params.id } };
    const result = await db.search(query, 'quiz');

	if (result.length > 0) {
        res.status(200).json(result[0]);
    } else {
        res.status(400).json({'response': `Question ${req.params.id} not found.`});
    }
});

router.post('/delete/:id', async (req, res) => {
    if (!db.connected)
        await db.connect();

    const query = { id: { $eq: req.params.id } };
    const result = await db.search(query, 'quiz');

    if (result.length > 0){
        db.delete(query, 'quiz');
        res.status(200).json(result[0]);
    } else {
        res.status(400).json({'response': `Question ${req.params.id} not found.`});
    }
})

// add a list of new questions for a specified course
router.post('/add', async (req, res) => {
    // error checking
    if(!req.body.questions && !req.body.courseCode) {
        res.status(400).json({'response': 'Missing body parameters: questions, courseCode'});
        return;
    } else if(!req.body.questions || req.body.questions.length === 0) {
        res.status(400).json({'response': 'Missing body parameters: questions'});
        return;
    } else if(!req.body.courseCode){
        res.status(400).json({'response': 'Missing body parameters: courseCode'});
        return;
    }

    // get parameters from the request
    const courseCode = req.body.courseCode;
    const newQuestions = req.body.questions;

    // map questions list into quiz database objects
    const questionMap = newQuestions.map(q => {
        const question = q.question;
        const answer = q.answer;
        return {courseCode, question, answer };
    });

    // get keywords for the quiz questions
    const taggedItems = await data_extraction.getQuizTags(questionMap, courseCode);

    // add to database
    if (!db.connected)
        await db.connect();
    db.addToCollection(taggedItems.map(x=>{return{...x, id: uuid.v4()}}), 'quiz');

    res.status(200).json({'response': `${questionMap.length} questions added.`});
});

module.exports = router;
