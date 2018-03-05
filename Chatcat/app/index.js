'use strict';

// Social authentication logic
require('./auth')();

module.exports = {
  router: require('./routes/index')(),
  session: require('./session')
}