var _ = require('underscore');
var request = require('request');
var async = require('async');

var logger = require('./logger');

var iterator = program.series ? 'eachSeries' : 'each';

function doRequest(clientNumber) {

  return function(requestNumber, done) {

    // request options

    var options = {
      uri: program.url,
      method: program.method,
      timeout: program.timeout * 1000,
      pool: false
    };

    // assigning basic authentication

    if (typeof program.auth !== 'undefined') {
      var credentials = new Buffer(program.auth).toString('base64');
      options.headers = {
        'authorization': credentials
      };
    }

    // assigning request body

    if (typeof program.body !== 'undefined') {
      options.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
      options.body = program.body;
    }

    // assigning request body as JSON

    if (typeof program.json !== 'undefined') {
      options.json = program.json;
    }

    // assigning querystring

    if (typeof program.querystring !== 'undefined') {
      options.qs = querystring.parse(program.querystring);
    }

    // requesting

    request(options, function(err, res) {
      if (err) {
        return done(err);
      }
      var message = 'Client #' + clientNumber + ' Request #' + requestNumber;
      if (res.statusCode >= 200 && res.statusCode < 300) {
        message += (' Status: ' + res.statusCode).green;
      }
      if (res.statusCode >= 300 && res.statusCode < 400) {
        message += (' Status: ' + res.statusCode).cyan;
      }
      if (res.statusCode >= 400 && res.statusCode < 500) {
        message += (' Status: ' + res.statusCode).yellow;
      }
      if (res.statusCode >= 500 && res.statusCode < 600) {
        message += (' Status: ' + res.statusCode).red;
      }
      logger.log(message);
      done();
    });

  };

};

function clientRequest(clientNumber, done) {
  async[iterator](
    _.range(1, program.requests + 1),
    doRequest(clientNumber),
    function(err) {
      logger.log('Client #' + clientNumber + ' finished requesting');
      done(err);
    }
  );
}

module.exports = function(report) {
  global.startTimestamp = new Date().getTime();
  logger.log('Requesting...');

  if (program.clients === 1) {
    clientRequest(1, report);
  } else {
    async[iterator](
      _.range(1, program.clients + 1),
      clientRequest,
      report
    );
  }
};