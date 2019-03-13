const express = require('express');
const path = require('path');

module.exports = function(app)
{
    // Returns any static files in frontend `/dist`
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    // index
    app.get('/', (_, res) =>
      res.sendFile(path.join(__dirname, 'dist', 'index.html'))
    );

    // TODO: API endpoints


    // 404 catch all
    app.get('*', (_, res) =>
      res.sendFile(path.join(__dirname, 'public', '404.html'))
    );    
}
