var _ = require('underscore');

var logger = require('./logger');

if (process.argv.length === 1) {
  process.exit();
}

var validURL = new RegExp('(http|https)://(www.|)[a-z0-9.]{1,}');
var validMethods = ['get', 'post', 'put', 'delete', 'head', 'options'];
var validAuth = new RegExp('[ .#$*!-_a-zA-Z0-9]{1,}:[ .#$*!-_a-zA-Z0-9]{1,}');
var validParameters = new RegExp('[-a-zA-Z0-9]{1,}=[-a-zA-Z0-9]{1,}');

program.url = process.argv.pop();

if (!program.url.match(validURL)) {
  logger.error('Invalid URL', program.url, ['http://google.com', 'https://192.168.2.5:3000/path']);
}

if (_.indexOf(validMethods, program.method) === -1) {
  logger.error('Invalid HTTP method', program.method, validMethods);
}

if (!_.isUndefined(program.auth) && !program.auth.match(validAuth)) {
  logger.error('Invalid authentication', program.auth, ['username:password', 'us3rn4m3:lkp6!hiX']);
}

if (!_.isUndefined(program.body) && !program.body.match(validParameters)) {
  logger.error('Invalid body', program.body, 'param=value&another=value');
}

if (!_.isUndefined(program.json)) {
  try {
    if (program.json.charAt(0) !== '{') {
      program.json = require(program.json);
    } else {
      program.json = JSON.parse(program.json);
    }
  } catch(err) {
    logger.error('Invalid JSON', program.json, [
      '{"key": "value", "hello": "world"}',
      '/path/to/file.json'
    ]);
  }
}

if (!_.isUndefined(program.querystring) && !program.querystring.match(validParameters)) {
  logger.error('Invalid querystring', program.querystring, 'param=value&another=value');
}

if (_.isNaN(program.requests) || program.requests === 0) {
  logger.error('Invalid number of requests', program.requests, [100, 500, 1000]);
}

if (_.isNaN(program.clients) || program.clients === 0) {
  logger.error('Invalid number of concurrent clients', program.clients, [5, 10, 20]);
}

if (_.isNaN(program.timeout) || program.timeout === 0) {
  logger.error('Invalid timeout', program.timeout, [15, 45, 60]);
}