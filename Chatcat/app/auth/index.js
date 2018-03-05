'use strict';

const passport = require('passport');
const config = require('../config');
const helper = require('../helpers');
const FacebookStrategy = require('passport-facebook').Strategy;

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    // find the user ID
    helper.findById(id)
      .then(user => done(null, user))
      .catch(error => console.log('Error when deserializing the user'));
  })

  let authProcessor = (accessToken, refreshToken, profile, done) =>{
    // find a user in the local db using profile.id (i.e a query)
    // if the user is found, return the user data using the done() arrow function   
    console.log(accessToken, refreshToken, profile); 
    helper.findOne(profile.id)
      .then(result => {
        if (result) {
          done(null, result);
        } else {
          // Create a new user and return
          helper.createNewUser(profile)
            .then(newChatUser => done(null, newChatUser))
            .catch(error => console.log('Error creating chatuser'));
        }
      })

  } 
  
  // send our config fb to the passport strategy
  passport.use(new FacebookStrategy(config.fb, authProcessor));
}