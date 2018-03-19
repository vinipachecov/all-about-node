'use strict';

require('dotenv').load();
const Hapi = require('hapi');

const server = new Hapi.Server();

server.connection({
  port: process.env.port || 3000
});

//Register the modules that we need to use
//data we need to pass into our routes
server.register([
  {
    register: require('vision')    
  },
  {
    register: require('good'),
    options: {
      opsInterval: 10000,
      reporters: [{
        //first report template
        reporter: require('good-file'),
        events: {
          log: '*',
          ops: '*'
        },
        config: './applog.log'
      }]
    }    
  },
  {
  register: require('inert')
  },
{
    register: require('./core'),
    options: {
      data: require('../data/studentData.json')
    }
}], error => {
  if (error) {
    console.log('Error', error);
  } else {    
    server.start(() => {
      console.log('Hapi server runnning at: ', server.info.uri);
    });
  }
})

