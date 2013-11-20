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
        stdout.indexOf('Usage: httpmon [options] <url>').should.not.be.equal(-1);
        done();
      }
    );
  });  

  it('--version', function(done) {
    var version = require(__dirname + '/../package.json').version;
    exec(
      httpmon + '--version',
      function(err, stdout, stderr) {
        stdout.indexOf(version).should.not.be.equal(-1);
        done();
      }
    );
  });

  it('should be verbose', function(done) {
    exec(
      httpmon + '-n 5 -c 2 -v http://localhost:3000?status=200',
      function(err, stdout, stderr) {
        stdout.indexOf('Client #1 Request #5').should.not.be.equal(-1);
        stdout.indexOf('Client #2 Request #5').should.not.be.equal(-1);
        stdout.indexOf('Client #1 finished requesting').should.not.be.equal(-1);
        stdout.indexOf('Client #2 finished requesting').should.not.be.equal(-1);
        stdout.indexOf('Status: 200').should.not.be.equal(-1);
        stdout.indexOf('Generating report...').should.not.be.equal(-1);
        stdout.indexOf('Total time taken').should.not.be.equal(-1);
        stdout.indexOf('Average time taken per client').should.not.be.equal(-1);
        stdout.indexOf('Average time taken per request').should.not.be.equal(-1);
        done();
      }
    );
  });

  it('should show only the report (when not in verbose mode)', function(done) {
    exec(
      httpmon + '-n 5 -c 2 http://localhost:3000?status=200',
      function(err, stdout, stderr) {
        stdout.indexOf('Client #1 Request #5').should.be.equal(-1);
        stdout.indexOf('Client #2 Request #5').should.be.equal(-1);
        stdout.indexOf('Client #1 finished requesting').should.be.equal(-1);
        stdout.indexOf('Client #2 finished requesting').should.be.equal(-1);
        stdout.indexOf('Status: 200').should.be.equal(-1);
        stdout.indexOf('Generating report...').should.be.equal(-1);
        stdout.indexOf('Total time taken').should.not.be.equal(-1);
        stdout.indexOf('Average time taken per client').should.not.be.equal(-1);
        stdout.indexOf('Average time taken per request').should.not.be.equal(-1);
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
          stdout.indexOf('Client #1 Request #1').should.not.be.equal(-1);
          stdout.indexOf('Client #1 finished requesting').should.not.be.equal(-1);
          stdout.indexOf('Status: ' + status).should.not.be.equal(-1);
          stdout.indexOf('Generating report...').should.not.be.equal(-1);
          stdout.indexOf('Total time taken').should.not.be.equal(-1);
          stdout.indexOf('Average time taken per client').should.not.be.equal(-1);
          stdout.indexOf('Average time taken per request').should.not.be.equal(-1);
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