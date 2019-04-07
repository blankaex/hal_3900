const express = require('express');
const router = express.Router();
const DB = require('../../db');
const db = new DB();

// get all users
router.get('/', async (req, res) => {
    if (!db.connected)
        await db.connect();

    const result = await db.search({}, 'users');

	if (result.length > 0)
		res.status(200).send(result);
    else
        res.status(400).send("no users");
});

// get current user
router.get('/me', async (req, res) => {
	if(req.session.user)
		res.status(200).json(req.session.user);
	else
		res.status(200).send('please log in');
});

// sets the user of the current session
router.post('/set', async (req, res) => {
    if(req.session.user != req.body.zid) {
        if (!db.connected)
            await db.connect();

        const query = { zid: { $eq: req.body.zid } };
        const result = await db.search(query, 'users');

        if (result.length == 0)
            db.addToCollection([ { zid: req.body.zid } ], 'users');

        req.session.user = req.body.zid;
    }

    res.status(200).send(req.session.user);
});

module.exports = router;
