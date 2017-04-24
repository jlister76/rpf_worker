'use strict';

const loopback = require('loopback');
const boot = require('loopback-boot');
const path = require('path');
const bodyParser = require('body-parser');

const app = module.exports = loopback();

app.set('view engine', 'ejs'); // LoopBack comes with EJS out-of-box
// must be set to serve views properly when starting the app via `slc run` from
// the project root
app.set('views', path.resolve(__dirname, 'views'));

// configure body parser
app.use(bodyParser.urlencoded({extended: true}));

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
