const express = require('express');
const session = require('express-session');
const mongodb = require('mongodb');
const dbUrl = 'mongodb://localhost:27017';
const dbName = 'database'

const router = express.Router();

// test "db"
const db = [
	{ id: 0, name: 'Ellen' },
	{ id: 1, name: 'Hayden' },
	{ id: 2, name: 'Yi' },
	{ id: 3, name: 'Zain' }
];

// get all users
router.get('/', async (req, res) => {
	res.status(200).json(db);
});

// get current user
router.get('/me', async (req, res) => {
	// this is broken atm
	// can't figure out how to access express.session
	if(express.session.user)
		console.log(express.session.user);
	else
		res.status(200).send('u r no one');
});

// get any user, create if doesn't exist
router.get('/:name', (req, res) => {
	if (db.some(db => db.name === req.params.name)) {
		res.json(db.filter(db => db.name === req.params.name));
	} else {
		// this part is also broken
		// express.session.user = name;
		db.push({id: db.length, name: req.params.name});
		res.status(200).json({ msg: `Created user ${req.params.name}` });
	}
});

module.exports = router;
