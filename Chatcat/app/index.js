'use strict';

const router = require('express').Router();

// router.get('/', (req,res,next ) => {
//   res.render('login');
// })

module.exports = {
  router: require('./routes/index')()
}