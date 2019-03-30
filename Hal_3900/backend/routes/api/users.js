const express = require('express');
const session = require('express-session');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const dbUrl = 'mongodb://localhost:27017';
const dbName = 'database'

const router = express.Router();

const UserSchema = new mongoose.Schema({
    id: {
          type: Number,
          unique: true,
          required: true,
          trim: true
        },
    name: {
          type: String,
          unique: true,
          required: true,
          trim: true
        }
});

// test "db"
const db = [
	{ id: 0, name: 'Ellen' },
	{ id: 1, name: 'Hayden' },
	{ id: 2, name: 'Yi' },
	{ id: 3, name: 'Zain' }
];

// test
router.get('/', async (req, res) => {
	if (req.session.count) {
		req.session.count++
		res.setHeader('Content-Type', 'text/html')
		res.write('<p>count: ' + req.session.count + '</p>')
		res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
		res.end()
	} else {
		req.session.count = 1
		res.end('refresh')
	}
});

// get all users
// router.get('/', async (req, res) => {
// 	res.status(200).json(db);
// });

// get current user
router.get('/me', async (req, res) => {
    console.log(req.session.user);
	if(req.session.user)
		res.status(200).json(req.session.user);
	else
		res.status(200).send('u r no one');
});

// get any user, create if doesn't exist
router.get('/:name', (req, res) => {
    req.session.user = req.params.name;
	if (db.some(db => db.name === req.params.name)) {
		res.status(200).json(db.filter(db => db.name === req.params.name));
	} else {
		db.push({id: db.length, name: req.params.name});
		res.status(200).json({ msg: `Created user ${req.params.name}` });
	}
});

module.exports = router;
