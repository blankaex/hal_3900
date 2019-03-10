const express = require('express');
const path = require('path');

module.exports = function(app)
{
    // Returns any static files in `/public`, i.e. `/about.html`
    app.use(express.static(path.join(__dirname, 'public')));

    // 404
    app.get('*', (req, res) =>
      res.sendFile(path.join(__dirname, 'public', '404.html'))
    );
}
