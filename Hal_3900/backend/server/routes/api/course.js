const express = require('express');
const router = express.Router();
const DB = require('../../db');
const db = new DB();

// get all course details
router.get('/', async (req, res) => {
    if (!db.connected){
        await db.connect();
    }
    const result = db.search({}, 'course');
    res.status(200).json(result);
});

// get course stats by course code


