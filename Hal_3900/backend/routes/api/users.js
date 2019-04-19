const express = require('express');
const router = express.Router();
const DB = require('../../db');
const db = new DB();

// get all users
router.get('/', async (req, res) => {


    const result = await db.search({}, 'users');

	if (result.length > 0)
		res.status(200).json(result);
    else
        res.status(400).json({'response': 'No users found.'});
});

// get current user
router.get('/me', async (req, res) => {
	if(req.session.user)
		res.status(200).json({'user': req.session.user});
	else
		res.status(200).json({'response': 'Not logged in.'});
});

// get specific user
router.get('/:zid', async (req, res) => {
    if (!db.connected)
        await db.connect();

    const query = { zid: { $eq: req.params.zid } };
    const result = await db.search(query, 'users');

	if (result.length > 0)
		res.status(200).json(result[0]);
    else
        res.status(400).json({'response': `zid ${req.params.zid} not found.`});
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

    res.status(200).json({'user': req.session.user});
});

module.exports = router;
