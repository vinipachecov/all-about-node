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

  io.of('/chatter').on('connection', socket => {
      // join a chatroom
      socket.on('join', data => {
        let usersList = h.addUserToRoom(allrooms, data, socket);        

        //update the list of active users as shown on the chatroom page
        socket.broadcast.to(data.roomID).emit('updateUsersList', JSON.stringify(usersList.users));
        socket.emit('updateUsersList', JSON.stringify(usersList.users));
      });

      // when a socket exits
      socket.on('disconnect', () => {
        //fnd the room, to which the socket is connected to and remove the user
        let room = h.removeUserFromRoom(allrooms, socket);
        socket.broadcast.to(room.roomID).emit('updateUsersList', JSON.stringify(room.users));
      });

      //when a new message arrives
      socket.on('newMessage', data => {
        socket.to(data.roomID).emit('inMessage', JSON.stringify(data));
      });
  });

}