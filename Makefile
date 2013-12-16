REPORTER = dot

test: hint
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--bail \
		test/*.js

hint:
	@./node_modules/.bin/jshint bin lib

.PHONY: test