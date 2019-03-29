const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
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
    cookie: { secure: true }
}));

// User API endpoint
const users = require('./routes/api/users');
app.use('/api/users', users)

// Get routes
require('./router')(app);

const PORT = process.env.PORT || 9447;

app.listen(PORT, () => console.log(`Server started on localhost:${PORT}`));
