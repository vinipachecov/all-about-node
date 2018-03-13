'use strict';

const router = require('express').Router();
const db = require('../db');
const crypto = require('crypto');

let _registerRoutes = (routes, method) => {
  for(let key in routes) {
    if(typeof routes[key] === 'object' && routes[key] !== null && !(routes[key] instanceof Array)) {
      _registerRoutes(routes[key], key);
    } else {
      // register the routes
      if (method === 'get') {
        router.get(key, routes[key]);          
      } else if (method === 'post') {
        router.post(key, routes[key]);
      } else {
        router.use(routes[key]);
      }
    }
  }
}

let route = routes => {
	_registerRoutes(routes);
	return router;
}

// Find a single user based on a key
let findOne = profileID => {
	return db.userModel.findOne({
		'profileId': profileID
	});
}

// Create a new user and returns that instance
let createNewUser = profile => {
	return new Promise((resolve, reject) => {
		let newChatUser = new db.userModel({
			profileId: profile.id,
			fullName: profile.displayName,
			profilePic: profile.photos[0].value || ''
		});

		newChatUser.save(error => {
			if(error) {
				reject(error);
			} else {
				resolve(newChatUser);
			}
		});
	});
}

// The ES6 promisified version of findById
let findById = id => {
	return new Promise((resolve, reject) => {
		db.userModel.findById(id, (error, user) => {
			if(error) {
				reject(error);
			} else {
				resolve(user);
			}
		});
	});
}

// Create a middleware function to prevent users to access routes which they are not authorized
let isAuthenticated = (req, res, next) => {
	// isAuthenticated is a passport method that returns true or false for our
	// authentication
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/');
	}
}

//find a chatroom given a name

let findRoomsByName = (allrooms, room) => {
	let findRoom = allrooms.findIndex((element, index, array) => {
		if (element.room === room) {
			// finds a room equal
			return true;
		} else {
			// doesnt' find a room 
			return false;
		}
	});
	return findRoom > -1 ? true: false;
}

// a function that generates a unique roomID
let randomHex = () => {
	return crypto.randomBytes(24).toString('hex');
}

//Find a chatroom given an ID
let findRoomById = (allrooms, roomID) => {
	return allrooms.find((element, index, array) => {
		if (element.roomID === roomID) {
			return true;
		} else {
			return false;
		}
	})
}

let addUserToRoom = (allrooms, data, socket) => {
	// get the room object
	let getRoom = findRoomById(allrooms, data.roomID);
	if (getRoom !== undefined) {
		// get the active user's ID (ObjectID as used in session)
		let userID = socket.request.session.passport.user;
		// check to see if this user already exists in the chatroom
		let checkUser = getRoom.users.findIndex((element, index, array) => {
			if(element.userID === userID) {
				return true;
			} else {
				return false;
			}
		});

		// if the user is already present in the room, remove him FIRST
		if (checkUser > -1) {
			getRoom.users.splice(checkUser, 1);
		}

		// PUsh the user into room's users array ***
		getRoom.users.push({
			socketID: socket.id,
			userID,
			user: data.user,
			userPic: data.userPic
		});

		//Join the room channel
		socket.join(data.roomID);

		//return the updated room object 
		return getRoom;

	}
}

let removeUserFromRoom = (allrooms, socket) => {
	for ( let room of allrooms) {
		let findUser = room.users.findIndex((element, index, array) => {
			if (element.socketID === socket.id) {
				return true;				
			} else {
				return false;
			}

			// return element.socketID === socket.id ? true : false

		});

		if (findUser > -1) {
			socket.leave(room.roomID);
			room.users.splice(findUser, 1);
			return room;
		}
	}
}

module.exports = {
  route,
	findOne,
	createNewUser,
	findById,
	isAuthenticated,
	findRoomsByName,
	randomHex,
	findRoomById,
	addUserToRoom,
	removeUserFromRoom
}