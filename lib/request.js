var _ = require('underscore')
  , request = require('request')
  , events = require('events')
  , util = require('util')
  , querystring = require('querystring')
  , async = require('async')
  , error = require('./error');

var Client = module.exports = function(program, progressBar) {
  async.forEachSeries(
    _.range(program.requests),
    function(iterator, callback) {

      // request options

      var options = {
        uri: program.url,
        method: program.method,
        timeout: program.timeout * 1000,
        pool: false
      };

      // assigning basic authentication

      if (program.auth !== undefined) {
        var credentials = new Buffer(program.auth).toString('base64');
        options.headers = {
          'authorization': credentials
        };
      }

      // assigning request body

      if (program.body !== undefined) {
        options.headers = {'content-type': 'application/x-www-form-urlencoded'};
        options.body = program.body;
      }

      // assigning request body as JSON

      if (program.json !== undefined) {
        options.json = program.json;
      }

      // assigning querystring

      if (program.querystring !== undefined) {
        options.qs = querystring.parse(program.querystring);
      }

      // requesting

      request(options, function(err) {

        // handling request module's exceptions

        if (err) {
          error('\nRequest error', err.message);
        }

        // filling the progress bar

        progressBar.tick(1);

        // calling next request

        if (program.interval > 0) {
          setTimeout(callback, program.interval);
        } else {
          callback();
        }
      });
    }
  );
};