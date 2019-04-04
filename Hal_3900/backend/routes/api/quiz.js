const express = require('express');
const session = require('express-session');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const dbUrl = 'mongodb://localhost:27017';
const dbName = 'database'

const router = express.Router();

// test "db"
const db = [
	{ 
        id: 0, 
        question: 'What should you fill a lecture hall with?',
        answer: 'Toast.'
    },
	{ 
        id: 1, 
        question: 'What colour is the sky?',
        answer: 'Green.'
    },
	{ 
        id: 2, 
        question: 'What are the MIPS $a registers conventionally used for?',
        answer: 'Storing arguments for function calls.'
    }
];

// add a new question
router.post('/add', (req, res) => {
    // very basic error checking
    if(!req.body.question && !req.body.answer)
        res.status(400).send("required params: question and answer");
    else if(!req.body.question)
        res.status(400).send("required params: question");
    else if(!req.body.answer)
        res.status(400).send("required params: answer");

    // add to "db"
    db.push({id: db.length, question: req.body.question, answer: req.body.answer});
    res.status(200).send('Added question');
});

// fetch a question
router.get('/question/:id', (req, res) => {
    // TODO: optional heuristic stuff based on user stats
	if (db.some(db => db.id === parseInt(req.params.id)))
		res.status(200).send(obj = db.filter(db => db.id === parseInt(req.params.id))[0]);
    else
        res.status(400).send("invalid question id");
});

module.exports = router;
