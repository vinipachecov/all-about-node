'use strict';

const SocketIO = require('socket.io');
const Stomp = require('stomp-client');

function main (server, options, next) {
  //helps us to connect to apache apollo
  const connectOpt = [
    process.env.appHost, 
    process.env.appPort,
    process.env.appUser,
    process.env.appPass];    
    const outQueue = '/queue/toPython';
    const inQueue = '/queue/fromPython';
    const events = require('events');
    const observe = new events.EventEmitter();
    const client = new Stomp(...connectOpt);
  // server.listener gives us the access to the main instance of hapi
    const io = SocketIO(server.listener);
    // customize a standard array
    let itemArray =  new Proxy([], {
      // how it will be customized
      get: function(target, property) {
        observe.emit('get');
        return target[property]; //itemArray[4]        
      },
      set: function(target, property, value) {
        observe.emit('set');
        target[property] = value; // itemArray[3] ='Johnny Kage'
        return true;
      }
    });

    //Our promises
    function stopmClient() {
      return new Promise((resolve, reject) => {
        client.connect(sessionId => {
          console.log('Connected to APache Apollo ');  

          client.subscribe(inQueue, body => {
            itemArray.push(body);
            observe.emit('set');
          });

          // sucessfull achieved
          resolve(sessionId, client);
        }, error => {
          reject(error);
        });
      });
    }
  
   
 
  function ioConnect() {
    io.on('connection', socket => {
      console.log('connected :)');
  
      if (itemArray.length > 0) {
        //keep the button disabled
        socket.emit('buttonState', {
          state: false
        })
        .emit('allData', {
          dataArray: itemArray
        })
      } else {
        console.log('button state true')
        // enable the button
        socket.emit('buttonState', {
          state: true
        })
      }

      //Publish data to apollo
      socket.on('begin', () => {
        client.publish(outQueue, JSON.stringify(options.data));
      });

      //watch the itemArray for changes -- asynchronously
      observe.on('set', () => {
        socket.emit('item', {
          dataArray: itemArray[itemArray.length - 1]
        });
      })

    });    
  }

  //
  stopmClient()
    .then(ioConnect)
    .catch(err => {
      console.log('There was an error : ', error);
      server.log('error', 'Error: ' + err);
    })

  return next();
}

main.attributes = {
  name: 'main'
}

module.exports = main;


