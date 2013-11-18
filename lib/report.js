var logger = require('./logger');

module.exports = function(err) {
  if (err) {
    logger.error(err.message);
  }

  logger.log('Generating report...');

  function round(n) {
    return Math.round(n * 100) / 100;
  }

  var totalTime = new Date().getTime() - startTimestamp; // global.startTimestamp
  var averagePerClient = round(totalTime / program.clients);
  var averagePerRequest = round(totalTime / (program.clients * program.requests));

  logger.report(''
    + '\nTotal time taken: '.green + totalTime + 'ms'
    + '\nAverage time taken per client: '.green + averagePerClient + 'ms'
    + '\nAverage time taken per request: '.green + averagePerRequest + 'ms\n'
  );
};