'use strict';

const router = require('express').Router();

module.exports = () => {
  let routes = {
    'get': {
      '/': (req, res, next) => {
        res.render('login');        
      },
      '/rooms': (req, res, next) => {
        res.render('rooms');        
      },
      '/chat': (req, res, next) => {
        res.render('chatroom');        
      },
      
    },
    'post': {

    }
  }
  //iterate through the routes object and mount the routes

  let registerRoutes = (routes, method) => {
    for(let key in routes) {
      if(typeof routes[key] === 'object' && routes[key] !== null && !(routes[key] instanceof Array)) {
        registerRoutes(routes[key], key);
      } else {
        // register the routes
        if (method === 'get') {
          router.get(key, routes[key]);          
        } else if (method === 'post') {
          router.post(key, routes[key]);
        }
      }
    }
  }

  registerRoutes(routes);

  return router;

  
}
// module.exports = () => {
//   const routes = {
//     'get': {
//       '/': (req,res,next) => {
//         res.render('login');
//       },
//       '/rooms': (req,res,next) => {
//         res.render('rooms');
//       },
//       '/chat': (req,res,next) => {
//         res.render('chatroom');
//       },
//      },  
//     'post': {
//     }
//   };

//   let registerRoutes = (routes, method) => {
//     for(let key in routes) {
//       if (typeof routes['key'] === 'object' && routes[key] !== null && !(routes[key] instanceof Array)) {
//         registerRoutes(routes[key], key);
//       } else {
//         // register the routes
//         if (method === 'get') {
//           console.log('something');
//           router.get(key, routes[key]);
//         } else if (method === 'post') {
//           router.post(key, router[key]);
//         }
//       }
//     }    
//   }
  
//   registerRoutes(routes);

//   return router;
// }
