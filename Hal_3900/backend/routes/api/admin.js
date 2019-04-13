const express = require('express');
const router = express.Router();
const DB = require('../../db');
const db = new DB();

// sets the user of the current session
router.post('/setup', async (req, res) => {
    // get req.body.object
    console.log(req.body.pagesToScrape);

    res.status(200).json({'result': 'ok'});
});

module.exports = router;
