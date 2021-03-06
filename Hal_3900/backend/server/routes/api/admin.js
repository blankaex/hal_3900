const express = require('express');
const router = express.Router();
const DB = require('../../db');
const db = new DB();

// lists all admins
router.get('/all', async (req, res) => {
    if(!req.session.admin)
        res.status(401).json({'response': 'You are not authorized to make this request.'});

    if (!db.connected)
        await db.connect();

    const result = await db.search({}, 'admins');

    if (result.length > 0)
        res.status(200).json(result);
    else
        res.status(400).json({'response': 'No users found.'});
});

// get all settings
router.get('/settings/:course', async (req, res) => {
    if (!db.connected)
        await db.connect();
    const course = req.params.course;
    const query = {
        courseCode: {
            $eq: course
        }
    }
    const results = await db.search(query, 'courses')
    if (results.length <= 0) {
        res.status(400).json({'error': 'unknown course'})
        return
    }
    const result = results[0];
    
    res.status(200).json({
        'confidence': result.confidenceThreshold,
        'sensitivity': result.trainingSensitivity
    });
});

// update settings
router.post('/settings', async (req, res) => {
    if (!db.connected)
        await db.connect();
    const course = req.body.courseCode;
    const query = {
        courseCode: {
            $eq: course
        }
    }
    const update = {
        confidenceThreshold: req.body.confidence, 
        trainingSensitivity: req.body.sensitivity 
    };
    const collection = db.dbConn.collection('courses');
    collection.updateOne(query, { $set: update })
    res.status(200).json({'ok':'ok'})
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
    res.status(200).json({'response': 'Username ' + req.body.username + ' registered as admin.'});
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

// log out as an admin
router.post('/logout', async (req, res) => {
    req.session.user = undefined;
    req.session.admin = undefined;
    res.status(200).json({'response': 'Logged out successfully.'});
});


// sets the user of the current session
router.post('/setup', async (req, res) => {
    // get req.body.object
    console.log(req.body.pagesToScrape);
    try {
        // call the course setup code in db from here
        await db.runDataExtraction(req.body.pagesToScrape);
        // add course to database
        const courseDetails = {
            courseCode: req.body.courseCode,
            courseName: req.body.courseName,
            confidenceThreshold: 0.1,
            trainingSensitivity: 0.3
        }
        await db.addToCollection([courseDetails],'courses');
        res.status(200).json({'result': 'ok'});

    } catch {
        // res.status(400).json({'result': 'bad request'});
    }
});

module.exports = router;
