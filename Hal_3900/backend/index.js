const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const logger = require('log4js').getLogger('Index');
logger.level = 'info';
require('express-ws')(app);

// Middleware
var whitelist = [
    'http://hal-3900.com',
    'http://localhost:8080'
]
const corsOptions = {
  origin: function (origin, callback) {
    // origin is undefined for localhost i think, which we always allow
    if (whitelist.indexOf(origin) !== -1 || origin === undefined) {
      callback(null, true)
    } else {
      callback(new Error(`<${origin}> Not allowed by CORS`))
    }
  },
  credentials: true
}

app.use(cors(corsOptions));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Session
app.set('trust proxy', 1);
app.use(session({
    secret: 'flag{this_is_a_flag}',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }
}));

// Get routes
require('./routes/router')(app);

const PORT = process.env.PORT || 9447;

app.listen(PORT, () => {
    logger.info(`Server started on localhost:${PORT}`);
});
