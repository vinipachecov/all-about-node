'use strict';

// Social authentication logic
require('./auth')();

//Create an IO Server instance
let ioServer = app => {
  app.locals.chatrooms = [];
  const server = require('http').Server(app);
  const io = require('socket.io')(server);
  io.use((socket, next) => {
    require('./session')(socket.request, {}, next);
  });
  //executes all of our code related to Socket.io 
  require('./socket')(io, app);
  return server;
}

module.exports = {
  router: require('./routes/index')(),
  session: require('./session'),
  ioServer
}