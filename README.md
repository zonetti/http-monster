# http-monster

A minimalist HTTP benchmarking.

## Install

    $> [sudo] npm install http-monster -g

## Basic usage

    $> httpmon -n 15 -c 2 http://github.com

## --help

    Usage: httpmon [options] <url>

      Options:

        -h, --help
        -V, --version
        -n, --requests [num]
        -c, --clients [num]
        -m, --method [http method]
        -a, --auth [username:password]
        -b, --body [param=value&param...]
        -j, --json [{"key": "value"}] or [@/path/to/file.json]
        -q, --querystring [param=value&param...]
        -i, --interval [ms]
        -t, --timeout [secs]