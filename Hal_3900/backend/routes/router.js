const express = require('express');
const path = require('path');
const bot = require('../bot');
const hal = new bot()

module.exports = function(app)
{
    // Returns any static files in frontend `/dist`
    // ### is this necessary?
    app.use(express.static(path.join(__dirname, '../../frontend/dist')))

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

    // 404 catch all
    app.get('*', (_, res) =>
        res.sendFile(path.join(__dirname, '../../frontend/dist', '404.html'))
    );    
}
