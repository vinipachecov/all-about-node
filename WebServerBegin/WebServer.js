'use strict';
const http = require('http');
const url = require('url');

const path = require('path');
// helps with loading files 
const fs = require('fs');

let mimes = { 
  '.htm': 'text/html',
  '.css': 'text/css', 
  '.js': 'text/javascript',
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
}

function webserver(req, res) {
  // load index if the route '/' is required

  let baseURI = url.parse(req.url);
  let filepath = __dirname + (baseURI.pathname === '/' ? '/index.htm' : baseURI.pathname);
  console.log(filepath);

  // check if the request file is accessible or not ( does it exists?)
  fs.access(filepath, fs.F_OK, error => {
    if (!error) {
      // Read and serve the file over response
      fs.readFile(filepath, (error, content) => {
        if (!error) {
          console.log('Serving', filepath);
          // serve the file from the buffer
          let contentType = mimes[path.extname(filepath)]; // mimes['.css] === 'text/css
          res.writeHead(200, {'Content-type': contentType});
          res.end(content, 'utf-8');
        } else {
          // serve a 500
          res.writeHead(500);
          res.end('The server could not read the file requested.');
        }
      })
    } else {
      //  serve a 404
      res.writeHead(404);
      res.end('Content not found');
    }
  });
}

http.createServer(webserver).listen(3000, () => {
  console.log('Running webserver on port 3000');
})