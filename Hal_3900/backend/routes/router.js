module.exports = function(app)
{
    // User API endpoint
    //const users = require('./api/users');
    //app.use('/api/users', users)

    // Quiz API endpoint
    const quiz = require('./api/quiz');
    app.use('/api/quiz', quiz)
}
