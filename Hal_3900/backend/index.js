const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const wsApp = require('express-ws')(app);

// Middleware
app.use(cors());
app.use(bodyParser.json({ extended: true })); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
// store this in db for persistence
// docs https://www.npmjs.com/package/express-session
app.set('trust proxy', 1);
app.use(session({
    secret: 'flag{this_is_a_flag}',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true, maxAge: 3600000 },
    cookie: { maxAge: 3600000 },
	// store: new MongoStore({
	// 	mongooseConnection: db
	//   })
}));

// User API endpoint
const users = require('./routes/api/users');
app.use('/api/users', users)

// Quiz API endpoint
const quiz = require('./routes/api/quiz');
app.use('/api/quiz', quiz)

// Get routes
require('./routes/router')(app);

const PORT = process.env.PORT || 9447;

app.listen(PORT, () => console.log(`Server started on localhost:${PORT}`));
