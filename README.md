# http-monster

A HTTP benchmarking toolkit for CLI written in NodeJS.

## Install

    $> [sudo] npm install http-monster -g

## httpmon

It looks like `ab`, but it is not.

### Basic usage

    $> httpmon -n 15 -c 2 http://github.com

### --help

    Usage: httpmon [options] <url>

      Options:

        -h, --help
        -V, --version
        -n, --requests [num]
        -c, --clients [num]
        -m, --method [http method]
        -a, --auth [username:password]
        -b, --body [param=value&param...]
        -j, --json [{"key": "value"}] or [/path/to/file.json]
        -q, --querystring [param=value&param...]
        -i, --interval [ms]
        -t, --timeout [secs]

## httpmon-browser

It simulates a browser through [Zombie.js][zombie], so you can login into a website and then request internal routes. All you need to do is to setup a benchmarking file like `benchmarking.example.json`.

**OBS:** Information about CSS Selectors and log-related issues can be found at [Zombie.js][zombie].

### Basic usage

    $> httpmon-browser benchmarking.json

### --help

    Usage: httpmon-browser [options] <benchmarking file>

      Options:

        -h, --help
        -V, --version
        -c, --clients [num]  number of concurrent clients (default: 1)

[zombie]: http://zombie.labnotes.org