const express = require('express');
const router = express.Router();
const DB = require('../../db');
const db = new DB();

// get all course details
router.get('/', async (req, res) => {
    if (!db.connected){
        await db.connect();
    }
    const result = await db.search({}, 'courses');
    console.log(result);
    res.status(200).json(result);
});

// get course stats by course code
router.post('/stats', async (req, res) => {
    if (!db.connected){
        await db.connect();
    }

    const query = { courseCode: req.body.courseCode };
    const result = await db.search(query, 'courseStats');

    if (result.length > 0) {
        res.status(200).json(result[0]);
    } else {
        res.status(400).json({'response': `Course ${req.body.courseCode} not found.`});
    }
});


module.exports = router;
