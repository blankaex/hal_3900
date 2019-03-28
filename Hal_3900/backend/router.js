const express = require('express');
const path = require('path');
const cors = require('cors');
const sess = require('express-session');
const bot = require('./bot');
const hal = new bot()

module.exports = function(app)
{
    // Returns any static files in frontend `/dist`
    app.use(express.static(path.join(__dirname, '../frontend/dist')))

    // Middleware
    app.use(cors());
    // store this in db for persistence
	// docs https://www.npmjs.com/package/express-session
    app.use(sess({secret:"flag{this_is_a_flag}",resave:false,saveUninitialized:true})); 
    app.use(express.json());       // to support JSON-encoded bodies
    app.use(express.urlencoded()); // to support URL-encoded bodies

    // Login stuff test
    app.post('/register', function(req, res) {
        var obj = { user: "", pass: "" };
        obj.user = req.body.user;
		obj.pass = req.body.pass;
        var json = JSON.stringify(obj);
        var fs = require('fs');
        fs.writeFile('test.json', json, 'utf8', function(err){
            if(err) throw err;
        });
		return res.status(200).send('probably registered');
    })

    app.post('/login', function(req, res) {
        var fs = require('fs');
		var obj = JSON.parse(fs.readFileSync('test.json', 'utf8'));
		if(obj.user === req.body.user && obj.pass === req.body.pass) {
			req.session.user = req.body.user;
			return res.status(200).send('logged in');
		} else {
			return res.status(401).send('nop');
		}
			
    })

    app.get('/dashboard', function(req, res) {
        if(!req.session.user) // this isn't global for some reason
            return res.status(401).send('401');
        return res.status(200).send('sekrit club');
    })

    // Web socket connection
    app.ws('/talk', function(ws, req) {
        ws.on('message', function(msg) {
            msg = JSON.parse(msg)
            if (msg.type === 'message') {
                ws.send(JSON.stringify({
                    type: 'message',
                    error: false,
                    text: hal.query(msg.text)
                }))
            } else {
                ws.send(JSON.stringify({
                    type: 'error',
                    error: true,
                    msg: 'Unknown Message Type'
                }))
            }
        });
    });

    // 404 catch all
    app.get('*', (_, res) =>
        res.sendFile(path.join(__dirname, '../frontend/dist', '404.html'))
    );    
}
