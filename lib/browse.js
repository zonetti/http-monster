var _ = require('underscore')
  , request = require('request')
  , async = require('async')
  , error = require('./error')
  , Browser = require('zombie');

module.exports = function(progressBar, benchmarking, report) {

  var browser = new Browser({
    debug: true,
    runScripts: false
  });

  var browseTargets = function() {

    // targets loop

    async.forEachSeries(
      benchmarking.targets,
      function(target, targetCompleted) {
        var targetStart = new Date().getTime();

        // requests loop

        async.forEachSeries(
          _.range(target.requests),
          function(iterator, requestCompleted) {
            var requestStart = new Date().getTime();
            progressBar.tick(1);
            browser.visit(target.url, function(err) {

              // storing statistics

              var requestDuration = new Date().getTime() - requestStart;
              report[target.url].requestDuration.push(requestDuration);
              requestCompleted(err);
            });
          },
          function(err) {
            var targetDuration = new Date().getTime() - targetStart;
            report[target.url].clientDuration.push(targetDuration);
            targetCompleted(err);
          }
        );
      },
      function(err) {
        if (err) error('Request error', err.message);
        progressBar.tick(1);
      }
    );
  };

  if (benchmarking.authentication !== undefined) {
    browser.visit(benchmarking.authentication.url, function() {
      for (var field in benchmarking.authentication.form.fields) {
        browser.fill(field, benchmarking.authentication.form.fields[field]);
      }
      browser.pressButton(benchmarking.authentication.form.submit, function() {
        browseTargets();
      });
    });
  } else {
    browseTargets();
  }

};