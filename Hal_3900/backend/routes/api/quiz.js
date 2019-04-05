const express = require('express');
const router = express.Router();
const DB = require('../../db');
const db = new DB();
const uuid = require('uuid');

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
    if (!db.connected) {
        await db.connect()
    }
    const uniqueId = uuid.v4();
    db.addToCollection([
        {
            id: uniqueId,
            question: req.body.question,
            answer: req.body.answer
        }
    ], 'quizQuestions');
    res.status(200).send(`Added question with id ${uniqueId}`);
});

// fetch a question
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    if (!db.connected) {
        await db.connect()
    }
    // TODO: optional heuristic stuff based on user stats
    const query = {
        id: {
            $eq: id
        }
    };
    const result = await db.search(query,'quizQuestions');
    console.log(await db.search({},'quizQuestions'));
	if (result.length > 0)
		res.status(200).send(result[0]);
    else
        res.status(400).send("invalid question id");
    
});

module.exports = router;
