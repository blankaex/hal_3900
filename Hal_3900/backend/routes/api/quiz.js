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

    const result = await db.search({}, 'quiz');

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
    // very basic error checking
    if(!req.body.question && !req.body.answer)
        res.status(400).json({'response': 'Missing body parameters: question, answer'});
    else if(!req.body.question)
        res.status(400).json({'response': 'Missing body parameters: question'});
    else if(!req.body.answer)
        res.status(400).json({'response': 'Missing body parameters: answer'});

    // create object
    const uniqueId = uuid.v4();
    const quizItem = {
        id: uniqueId,
        question: req.body.question,
        answer: req.body.answer
    };

    // Classify content with tags
    // NOTE you will need to have NLP service account set up to use this: same process as DF service account.
    const itemWithTags = analyzer.process_quiz_item(quizItem);

    // add to db
    if (!db.connected)
        await db.connect();

    db.addToCollection([itemWithTags], 'quiz');

    res.status(200).json({'response': `Question ${uniqueId} added.`});
});

module.exports = router;
