var request = require('request')
  , events = require('events')
  , util = require('util')
  , querystring = require('querystring');

var HTTPResponse = function() {
  events.EventEmitter.call(this);
};
util.inherits(HTTPResponse, events.EventEmitter);

var Client = module.exports = function(program, progressBar) {
  for (var i = 0; i < program.requests; i++) {

    var res = new HTTPResponse()
      , options = {
        uri: program.url,
        method: program.method,
        timeout: program.timeout * 1000
      };

    // filling progress bar

    res.end = function() {
      progressBar.tick(1);
    };

    // handling request module's exceptions

    process.on('uncaughtException', function(err) {
      console.log();
      error('Request error', err.message);
    });

    // assigning basic authentication, if defined

    if (program.auth !== undefined) {
      var credentials = new Buffer(program.auth).toString('base64');
      options.headers = {
        'authorization': credentials
      };
    }

    // assigning request body, if defined

    if (program.body !== undefined) {
      options.headers = {'content-type': 'application/x-www-form-urlencoded'};
      options.body = program.body;
    }

    // assigning request body as JSON, if defined

    if (program.json !== undefined) {
      options.json = program.json;
    }

    // assigning querystring, if defined

    if (program.querystring !== undefined) {
      options.qs = querystring.parse(program.querystring);
    }

    // requesting (with intervals if defined)

    if (program.interval > 0) {
      setTimeout(function() {
        request(options).pipe(res);
      }, program.interval * (i + 1));
    } else {
      request(options).pipe(res);
    }
  }
};