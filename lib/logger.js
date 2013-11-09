var winston = require('winston');

function getTimestamp() {
  var now = new Date();
  var hours = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
  var minutes = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
  var seconds = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
  return '[' + hours + ':' + minutes + ':' + seconds + '] ';
}

exports.log = function(message) {
  if (!program.verbose) {
    return false;
  }
  winston.info(getTimestamp().cyan + message);
};

exports.error = function(message, description, examples) {
  if (!program.verbose) {
    return false;
  }
  var message = message.red.bold;
  if (typeof description !== 'undefined') {
    message += ': ' + description;
  }
  if (typeof examples !== 'undefined') {
    message += ' Example(s): '.bold.white + examples;
  }
  winston.log('error', message);
  process.exit();
};

exports.report = function(reportString) {
  console.log(reportString);
};