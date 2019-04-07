const uuid = require('uuid');
const express = require('express');
const router = express.Router();
const DB = require('../../db');
const db = new DB();

// get all questions
router.get('/', async (req, res) => {
    if (!db.connected)
        await db.connect()

    const result = await db.search({}, 'quiz');

	if (result.length > 0)
		res.status(200).send(result);
    else
        res.status(400).send("no questions");
});

// get a specific question
router.get('/:id', async (req, res) => {
    if (!db.connected)
        await db.connect();

    // TODO: optional heuristic stuff based on user stats
    const query = { id: { $eq: req.params.id } };
    const result = await db.search(query, 'quiz');

	if (result.length > 0)
		res.status(200).send(result[0]);
    else
        res.status(400).send("invalid question id");
});

// add a new question
router.post('/add', async (req, res) => {
    // very basic error checking
    if(!req.body.question && !req.body.answer)
        res.status(400).send("required params: question and answer");
    else if(!req.body.question)
        res.status(400).send("required params: question");
    else if(!req.body.answer)
        res.status(400).send("required params: answer");

    // add to db
    if (!db.connected)
        await db.connect()

    const uniqueId = uuid.v4();
    db.addToCollection([
        {
            id: uniqueId,
            question: req.body.question,
            answer: req.body.answer
        }
    ], 'quiz');

    res.status(200).send(`Added question with id ${uniqueId}`);
});

module.exports = router;
