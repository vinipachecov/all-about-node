'use strict';

const express = require('express');
// creates our basic instance of our application
// we can further create other instances and connect to this one
const app = express();
const chatCat = require('./app');

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
// View engine relate to our templates
app.set('view engine', 'ejs');


app.use('/', chatCat.router);

// listen on a port

app.listen(app.get('port'), () => {
  console.log('ChatCat is running on port ', app.get('port'));
})