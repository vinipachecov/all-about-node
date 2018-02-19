'use strict';

const h = require('../helpers');

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
      '/getsession': (req, res, next) => {
        res.send('My favorit Color: ' + req.session.favColor);        
      },
      '/setsession': (req, res, next) => {
        req.session.favColor = 'red';
        res.send('My favorit Color: ' + req.session.favColor);        
      },
      
    },
    'post': {

    },
    'NA': (req, res, next) => {
      res.status(404).sendFile(process.cwd() + '/views/404.htm');
    }
  }
  
  return h.route(routes);  
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
