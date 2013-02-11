var _ = require('underscore')
  , request = require('request')
  , async = require('async')
  , ProgressBar = require('progress-with-event')
  , error = require('./error');

var BrowseTargets = module.exports = function(browser, targets) {
  var start = new Date().getTime()
    , targetsReport = {}
    , totalRequests = 0;

  for (var i = 0; i < targets.length; i++)
    totalRequests += targets[i].requests;

  var progressBar = new ProgressBar('Requested '.yellow + ':percent '.white, {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: totalRequests
  });

  // targets loop

  async.forEachSeries(
    targets,
    function(target, targetCompleted) {
      var targetStart = new Date().getTime();

      // requests loop

      async.forEachSeries(
        _.range(target.requests),
        function(iterator, requestCompleted) {
          progressBar.tick(1);
          browser.visit(target.url, requestCompleted);
        },
        function(err) {

          // storing statistics

          var targetDuration = new Date().getTime() - targetStart;
          targetsReport[target.url] = {
            requests: target.requests,
            duration: targetDuration,
            average: Math.floor(targetDuration / target.requests)
          };
          targetCompleted(err);
        }
      );
    },
    function(err) {
      if (err) error('Request error', err.message);

      var duration = new Date().getTime() - start;

      // reporting

      console.log(
        '\nRequested '.yellow + '100%'.white + ' - ' +
        duration + 'ms (' + Math.floor(duration / 1000) + ' seconds)\n'
      );

      for (var target in targetsReport) {
        var stats = targetsReport[target];

        console.log('Target: '.white + target);
        console.log('  Requests: '.green + stats.requests);
        console.log(
          '  Time taken: '.green + stats.duration +
          'ms (' + Math.floor(stats.duration / 1000) + ' seconds)'
        );
        console.log('  Time per request (avg): '.green + stats.average + 'ms\n');
      }
    }
  );
};