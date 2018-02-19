'use strict';
const config = require('../config');
const Mongoose = require('mongoose').connect(config.dbURI);

// Log an error if the connection failes

Mongoose.connection.on('error', error => {
  console.log('MongoDB error: ', error)
});

module.exports = {
  Mongoose
};
