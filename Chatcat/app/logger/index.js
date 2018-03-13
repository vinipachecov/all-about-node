'use strict';

const winston = require('winston');
const logger = new (winston.createLogger)({
  transports: [  
    new (winston.transports.Console)({
      level: 'debug',
      json: true,
      handleExceptions: true
    })
  ],
  exitOnError: false,    
});

module.exports = logger;