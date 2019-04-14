const express = require('express');
const router = express.Router();
const DB = require('../../db');
const db = new DB();

// lists all admins
router.get('/all', async (req, res) => {
    if(req.session.admin === true) {
        if (!db.connected)
            await db.connect();

        const result = await db.search({}, 'admins');

        if (result.length > 0)
            res.status(200).json(result);
        else
            res.status(400).json({'response': 'No users found.'});
    } else {
            res.status(401).json({'response': 'You are not authorized to make this request.'});
    }
});

// registers user as admin
router.post('/register', async (req, res) => {
    if (!db.connected)
        await db.connect();

    const obj = {
        username: req.body.username, 
        password: req.body.password 
    };

    db.addToCollection([obj], 'admins');
    res.status(200).json({'response': 'Username ' + req.session.user + ' registered as admin.'});
});

// log in as an admin
router.post('/login', async (req, res) => {
    if (!db.connected)
        await db.connect();

    const query = {
        username: { $eq: req.body.username }, 
        password: { $eq: req.body.password } 
    };

    const result = await db.search(query, 'admins');

    if (result.length > 0) {
        req.session.user = req.body.username;
        req.session.admin = true;
        res.status(200).json({'response': 'Logged in as ' + req.session.user + '.'});
    } else {
        res.status(400).json({'response': 'Username or password invalid.'});
    }
});

module.exports = router;
