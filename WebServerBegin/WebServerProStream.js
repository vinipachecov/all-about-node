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

 async function fileAcess(filepath) {
  return new Promise((resolve, reject) => {
    fs.access(filepath, fs.F_OK, error => {
      if (!error) {
        resolve(filepath);
      } else {
        reject(error);
      }
    });
  });
}

async function streamFile(filepath) {
  return new Proomise ((resolve, reject) => {
    let fileStream = fs.createReadStream(filepath);

    fileStream.on('open', () => {
      resolve(fileStream);
    });

    fileStream.on('error', error => {
      reject(error);
    })
  });
}

async function webserver(req, res) {
  // load index if the route '/' is required

  let baseURI = url.parse(req.url);
  let filepath = __dirname + (baseURI.pathname === '/' ? '/index.htm' : baseURI.pathname);
  let contentType = mimes[path.extname(filepath)]; // mimes['.css] === 'text/css
  console.log(filepath);

  

  // async await approach
  try {
    const path = await fileAcess(filepath);
    const content = await streamFile(path);    
    res.writeHead(200, {'Content-type': contentType});
    // res.end(content, 'utf-8');
    fileStream.pipe(res);
  } catch (error) {
    console.log(error);
    res.writeHead(500);
    res.end(JSON.stringify(error));
  }   

}

http.createServer(webserver).listen(3000, () => {
  console.log('Running webserver on port 3000');
})