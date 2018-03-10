'use strict';

const h = require('../helpers');
const passport = require('passport');
const config = require('../config');

module.exports = () => {
  let routes = {
    'get': {
      '/': (req, res, next) => {
        res.render('login');        
      },
      // notice the use of brackets for inserting middleware functions
      // for previous data processing of a route
      '/rooms':[h.isAuthenticated, (req, res, next) => {
        res.render('rooms', {
          user: req.user,
          host: config.host
        });        
      }],
      '/chat/:id': [h.isAuthenticated, (req, res, next) => {
        //Find a chatroom with the given id
        // and then render it if the id is found
        let getRoom = h.findRoomById(req.app.locals.chatrooms, req.params.id);
        if (getRoom === undefined) {
          return next();
        } else {
          res.render('chatroom', {
            user: req.user,
            host: config.host,
            room: getRoom.room,
            roomID: getRoom.roomID
          });      
        }        
      }],
      '/getsession': (req, res, next) => {
        res.send('My favorit Color: ' + req.session.favColor);        
      },
      '/setsession': (req, res, next) => {
        req.session.favColor = 'red';
        res.send('My favorit Color: ' + req.session.favColor);        
      },
      '/auth/facebook': passport.authenticate('facebook'),
			'/auth/facebook/callback': passport.authenticate('facebook', {
				successRedirect: '/rooms',
				failureRedirect: '/'
      }),
      '/logout':(req,res,next) => {
        req.logout();
        res.redirect('/');
      }

      
    },
    'post': {

    },
    'NA': (req, res, next) => {
      res.status(404).sendFile(process.cwd() + '/views/404.htm');
    }
  }
  
  return h.route(routes);  
}