'use strict';

const h = require('../helpers');

module.exports = (io, app) => {  
  let allrooms = app.locals.chatrooms;


  io.of('/roomslist').on('connection', socket => {
    socket.on('getChatrooms', () => {
      socket.emit('chatRoomsList', JSON.stringify(allrooms));
    });
    console.log('socket.io connected to the client!');

    socket.on('createNewRoom', newRoomInput => {
      // check to see if a room with the same title exists or not
      // if not, create and broadcast it to everyone one
      if (!h.findRoomsByName(allrooms, newRoomInput)) {
        allrooms.push({
          room: newRoomInput,
          roomID: h.randomHex(),
          users: []
        });

        //Emit an updated list to the creater 
        socket.emit('chatRoomsList', JSON.stringify(allrooms));
        // Emit an updated list to everyone connected to the rooms page
        socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms));
      }
    });
  });

}