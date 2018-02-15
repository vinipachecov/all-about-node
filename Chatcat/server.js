'use strict';

const express = require('express');
// creates our basic instance of our application
// we can further create other instances and connect to this one
const app = express();
app.set('port', process.env.PORT || 3000);

let helloMiddleware = (req, res, next) => {
  req.hello = `Hello it's me I wa wondering... you get the idea`;
  next();
}

app.use(helloMiddleware);

app.get('/dashboard', (req,res, next) => {
  res.send(`<h1>This is the dashboard page</h1> Middleware says ${req.hello}`);
})

app.get('/', (req, res, next) => {
  res.send('<h1>Hello Express :>)</h1>');
  console.log(req.hello);
});

// listen on a port

app.listen(app.get('port'), () => {
  console.log('ChatCat is running on port ', app.get('port'));
})