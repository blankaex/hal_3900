const express = require('express');

const app = express();

// Get routes
require('./router')(app);

const PORT = process.env.PORT || 9447;

app.listen(PORT, () => console.log(`Server started on localhost:${PORT}`));
