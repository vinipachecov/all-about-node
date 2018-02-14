`use strict`;
const http = require(`http`);

// Setup a server that respond to get request, but no routes


http.createServer((req,res) => {
  res.writeHead(200, {'Context-type': 'text/html'});
  res.end('<h1>Hello NOde :)</h1>');
})
.listen(3000, () => console.log('Serving running on port 3000...'));