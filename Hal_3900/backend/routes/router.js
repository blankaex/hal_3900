const express = require('express');
const path = require('path');
const bot = require('../bot');
const hal = new bot()

module.exports = function(app)
{
    // Web socket connection
    // TODO: make not ugly
    app.ws('/talk', function(ws, req) {
      ws.on('message', function(msg) {
        msg = JSON.parse(msg)
        if (msg.type === 'message') {
          hal.query(msg.text).then(r=>{
            ws.send(JSON.stringify({
              type: 'message',
              error: false,
              data: r
            }))
          })
        } else {
          ws.send(JSON.stringify({
            type: 'error',
            error: true,
            msg: 'Unknown Message Type'
          }))
        }
      });
    });

    // User API endpoint
    const users = require('./api/users');
    app.use('/api/users', users)

    // Quiz API endpoint
    const quiz = require('./api/quiz');
    app.use('/api/quiz', quiz)
}
