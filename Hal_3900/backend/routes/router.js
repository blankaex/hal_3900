module.exports = function(app)
{
    // Web socket connection
    const talk = require('./talk');
    require('express-ws')(app);
    app.ws('/talk', ws => talk(ws));
    
    // User API endpoint
    const users = require('./api/users');
    app.use('/api/users', users)
    
    // Admin API endpoint
    const admin = require('./api/admin');
    app.use('/api/admin', admin)

    // Quiz API endpoint
    const quiz = require('./api/quiz');
    app.use('/api/quiz', quiz)

    // Admin API endpoint
    const admin = require('./api/admin');
    app.use('/api/admin', admin)
}
