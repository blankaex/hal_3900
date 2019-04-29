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


module.exports = router;
