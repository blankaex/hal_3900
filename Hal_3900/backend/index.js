const express = require('express');
const app = express();
const wsApp = require('express-ws')(app);

// Get routes
require('./router')(app);

const PORT = process.env.PORT || 9447;

app.listen(PORT, () => console.log(`Server started on localhost:${PORT}`));
