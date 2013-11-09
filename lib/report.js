var logger = require('./logger');

function round(n) {
  return Math.round(n * 100) / 100;
}

module.exports = function(err) {
  if (err) {
    logger.error(err);
    process.exit();
  }

  logger.log('Generating report...');

  var totalTime = new Date().getTime() - startTimestamp; // global.startTimestamp
  var averagePerClient = round(totalTime / program.clients);
  var averagePerRequest = round(totalTime / (program.clients * program.requests));

  console.log(''
    + '\nTotal time taken: '.green + totalTime + 'ms'
    + '\nAverage time taken per client: '.green + averagePerClient + 'ms'
    + '\nAverage time taken per request: '.green + averagePerRequest + 'ms\n'
  );
};