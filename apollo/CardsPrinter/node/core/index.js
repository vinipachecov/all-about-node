'use strict';

const Path = require('path');
// enable to integrate the module
function core(server, options, next) {

  // loading the routes into the pluging  
  server.route(require('./routes')(options));  

  //Configure hapi to use template files
  //Hnalderbars hepls with html tagging
  server.views({
    engines: {
      html: require('handlebars')
    },
    path: Path.join(__dirname, '../views')
  })


  // Core logic here
  server.register({
    register: require('./main'),
    options: {
      data: options.data
    }
  }, error => {
    if (error) {
      console.log('There was an error loading the main plugin...');
      server.log('error', 'Main plugin error: ' + err);
    }
  })


  return next();
}

// providing a name to the pluging
core.attributes = {
  name: 'core',
  dependencies: ['inert', 'vision']
}


module.exports = core;