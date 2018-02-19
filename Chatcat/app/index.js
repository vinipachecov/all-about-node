'use strict';

const router = require('express').Router();

module.exports = {
  router: require('./routes/index')(),
  session: require('./session')
}