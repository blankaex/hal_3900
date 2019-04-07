const express = require('express');
const app = express();
const logger = require('log4js').getLogger('Index');
logger.level = 'info';
require('express-ws')(app);

// Get routes
require('./router')(app);

const PORT = process.env.PORT || 9447;

app.listen(PORT, () => {
    logger.info(`Server started on localhost:${PORT}`);
});
