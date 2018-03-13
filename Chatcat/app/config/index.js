'use strict';

if (process.env.NODE_ENV === 'production') {
  //ofer production stage environment variables
  //process.env.REDIS_URL :: 
  let redisURI = require('url').parse(process.env.REDIS_URL);
  let redisPassword = redisURI.auth.split(':')[1];

  module.exports = {
    "host": process.env.host || "",
    "dbURI": process.env.dbURI,
    sessionSecret: process.env.sessionSecret,
    fb: {
      clientID: process.env.fbClientID,
      clientSecret: process.env.fbClientSecret,
      callback: process.env.host + '/auth/facebook/callback',
      profilefields: ['id', 'displayName', 'photos']
    },
    redis: {
      host: redisURI.hostname,
      port: redisURI.port,
      password: redisPassword
    }
  }

} else {
  module.exports = require('./development.json');
}