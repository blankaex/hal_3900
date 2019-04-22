const uuid = require('uuid');
const express = require('express');
const router = express.Router();
const DB = require('../../db');
const db = new DB();
const analyzer = require('../../data_extraction/analyze');

// get all questions
router.get('/', async (req, res) => {
    if (!db.connected)
        await db.connect()

    let result;

    if (req.body.courseCode){
        result = await db.search({courseCode: req.body.courseCode}, 'quiz');
    } else {
        result = await db.search({}, 'quiz');
    };

	if (result.length > 0)
		res.status(200).json(result);
    else
        res.status(400).json({'response': 'No questions found.'});
});

// get a specific question
router.get('/:id', async (req, res) => {
    if (!db.connected)
        await db.connect();

    // TODO: optional heuristic stuff based on user stats
    const query = { id: { $eq: req.params.id } };
    const result = await db.search(query, 'quiz');

	if (result.length > 0)
		res.status(200).json(result[0]);
    else
        res.status(400).json({'response': `Question ${req.params.id} not found.`});
});

// add a new question
router.post('/add', async (req, res) => {
    // admins only
    // TODO add in this check when admin login done
    // if(!req.session.admin)
    //     res.status(401).json({'response': 'You are not authorized to make this request.'});

    // very basic error checking
    if(!req.body.questions && !req.body.courseCode)
        res.status(400).json({'response': 'Missing body parameters: questions, courseCode'});
    else if(!req.body.questions || req.body.questions.length === 0)
        res.status(400).json({'response': 'Missing body parameters: questions'});
    if(!req.body.courseCode)
        res.status(400).json({'response': 'Missing body parameters: courseCode'});

    const courseCode = req.body.courseCode;
    const newQuestions = req.body.questions;
    // create objects
    const questionMap = newQuestions.map(q => {
        const id = uuid.v4();
        const question = q.question;
        const answer = q.answer;
        const tags = []; // TODO make this a call to analysis
        return { id, courseCode, tags, question, answer };
    });

    // TODO update to format of quiz question input
    // Classify content with tags
    // NOTE you will need to have NLP service account set up to use this: same process as DF service account.
    // const itemWithTags = analyzer.process_quiz_item(quizItem);

    console.log(questionMap);

    // add to db
    if (!db.connected)
        await db.connect();

    db.addToCollection(questionMap, 'quiz');
    // res.status(200).json({'response': `OK!!`});

    res.status(200).json({'response': `${questionMap.length} questions added.`});
});

module.exports = router;
