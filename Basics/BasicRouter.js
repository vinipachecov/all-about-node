'use strict';
const http = require('http');
const url = require('url');
const qs = require('querystring');


// our route hanlder
let routes = {
  'GET':  {
    '/' : (req, res) => {
      res.writeHead(200, { 'Content-type': 'text/html'});
      res.end('<h1>Hello Router</h1>');
    },
    'about': (req, res) => {
      res.writeHead(200, { 'Content-type': 'text/html'});
      res.end('<h1>About Router</h1>');
    },
    '/api/getinfo': (req, res) => {
      // fetch data from db and respond as JSON object
      res.writeHead(200, { 'Content-type': 'applicaton/json'});
      res.end(JSON.stringify(req.queryParams));
    }
   },
  'POST': {
    '/api/login': (req, res) => {
      let body = '';
      req.on('data', data => {
        body += data;
        // console.log(body.length);
        if (body.length > 2097152) {
          res.writeHead({'Content-type': 'text/html'});
          res.end('<h3>Erro: the file being uploaded exceeds limit of 3 2Mb</h3>', 
          () => req.connection.destroy());
        }
      });

      req.on('end', () => {
        let params = qs.parse(body);
        console.log(('Username: ', params['username']));
        console.log(('Password: ', params['password']));

        //end the response
        console.log(body);
        res.end();

      });
    }

  },
  'NA': (req, res) => {
    res.writeHead(404);
    res.end('Content not found!');
  }
}

function router (req,res){
  let baseURI = url.parse(req.url, true);
  let resolveRoute = routes[req.method][baseURI.pathname];
  if( resolveRoute != undefined) {
    req.queryParams = baseURI.query;
    resolveRoute(req, res);
  } else {
    routes['NA'](req, res);
  }
}

http.createServer(router).listen(3000, () => {
  console.log('Server running on port 3000');
})