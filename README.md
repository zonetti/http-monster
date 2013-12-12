# http-monster [![Build Status](https://secure.travis-ci.org/zonetti/http-monster.png)](http://travis-ci.org/zonetti/http-monster)

I don't intend to maintain this repository. I made this as an excuse to play with `node.js` and `CLI`.

If you are really looking for an HTTP benchmarking tool, make sure to take a look at [`ab`][ab] (Apache HTTP server benchmarking tool) and [`siege`][siege] (An HTTP/HTTPS stress tester). Those are awesome tools and MUCH more mature (I can't stress this enough).

## Install

    $> [sudo] npm install http-monster -g

## Basic usage

    $> httpmon -n 15 -c 2 -v http://github.com

## --help

    Usage: httpmon [options] <url>

      Options:

        -h, --help                                             output usage information
        -V, --version                                          output the version number
        -n, --requests [num]                                   number of requests per client (default: 50)
        -c, --clients [num]                                    number of concurrent clients (default: 1)
        -m, --method [http method]                             http method (default: get)
        -a, --auth [username:password]                         http authentication
        -b, --body [param=value&param...]                      request body (postfields)
        -j, --json [{"key": "value"}] or [/path/to/file.json]  request body as JSON
        -q, --querystring [param=value&param...]               querystring parameters
        -t, --timeout [secs]                                   request timeout (default: 30)
        -s, --series                                           request in series
        -v, --verbose                                          verbose mode

[ab]: http://httpd.apache.org/docs/2.2/programs/ab.html
[siege]: http://www.joedog.org/siege-home/
