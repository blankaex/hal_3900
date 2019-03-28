const express = require('express');
const cors = require('cors');
const app = express();
const wsApp = require('express-ws')(app);

// Middleware
app.use(cors());

// Get routes
require('./router')(app);

//API test stuff
const posts = require('./routes/api/posts');
app.use('/api/posts', posts)

const PORT = process.env.PORT || 9447;

app.listen(PORT, () => console.log(`Server started on localhost:${PORT}`));
