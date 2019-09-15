const express_bunyan = require('express-bunyan-logger');
const config = require('../config/config.json');



const log = express_bunyan({
    name: 'dependencyAPI',
    streams: [{
        type: 'rotating-file',
        level: 'info',
        path: config.log.filePath,
        period: '1d', 
        count: 2
    }]
})

module.exports = log;