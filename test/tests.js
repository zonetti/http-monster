var http = require('http');
var url = require('url');
var exec = require('child_process').exec;
var async = require('async');
var should = require('should');

var httpmon = __dirname + '/../bin/httpmon ';

describe('Tests', function() {

  before(function(done) {
    http.createServer(function(req, res) {
      var qs = url.parse(req.url, true).query;
      res.writeHead(qs.status, {'Content-Type': 'text/plain'});
      res.end('hello world');
    }).listen(3000, done);
  });

  it('--help', function(done) {
    exec(
      httpmon + '--help',
      function(err, stdout, stderr) {
        stdout.should.contain('Usage: httpmon [options] <url>');
        done();
      }
    );
  });  

  it('--version', function(done) {
    var version = require(__dirname + '/../package.json').version;
    exec(
      httpmon + '--version',
      function(err, stdout, stderr) {
        stdout.should.contain(version);
        done();
      }
    );
  });

  it('should be verbose', function(done) {
    exec(
      httpmon + '-n 5 -c 2 -v http://localhost:3000?status=200',
      function(err, stdout, stderr) {
        stdout.should.contain('Client #1 Request #5');
        stdout.should.contain('Client #2 Request #5');
        stdout.should.contain('Client #1 finished requesting');
        stdout.should.contain('Client #2 finished requesting');
        stdout.should.contain('Status: 200');
        stdout.should.contain('Generating report...');
        stdout.should.contain('Total time taken');
        stdout.should.contain('Average time taken per client');
        stdout.should.contain('Average time taken per request');
        done();
      }
    );
  });

  it('should show only the report (when not in verbose mode)', function(done) {
    exec(
      httpmon + '-n 5 -c 2 http://localhost:3000?status=200',
      function(err, stdout, stderr) {
        stdout.should.not.contain('Client #1 Request #5');
        stdout.should.not.contain('Client #2 Request #5');
        stdout.should.not.contain('Client #1 finished requesting');
        stdout.should.not.contain('Client #2 finished requesting');
        stdout.should.not.contain('Status: 200');
        stdout.should.not.contain('Generating report...');
        stdout.should.contain('Total time taken');
        stdout.should.contain('Average time taken per client');
        stdout.should.contain('Average time taken per request');
        done();
      }
    );
  });

  it('should handle status 2xx/3xx/4xx/5xx ', function(done) {
    function request(status, callback) {
      exec(
        httpmon + '-n 1 -v http://localhost:3000?status=' + status,
        function(err, stdout, stderr) {
          if (err) return callback(err);
          stdout.should.contain('Client #1 Request #1');
          stdout.should.contain('Client #1 finished requesting');
          stdout.should.contain('Status: ' + status);
          stdout.should.contain('Generating report...');
          stdout.should.contain('Total time taken');
          stdout.should.contain('Average time taken per client');
          stdout.should.contain('Average time taken per request');
          callback();
        }
      );
    }
    async.each(
      [200, 201, 300, 301, 400, 404, 500, 503],
      request,
      done
    );
  });

});
