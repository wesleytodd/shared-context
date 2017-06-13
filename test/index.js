/* global describe it */
var assert = require('assert');
var sharedContext = require('..');

describe('Shared Context', function () {
	it('should return a function', function () {
		assert.equal(typeof sharedContext(), 'function');
	});

	it('should add res.locals.context by default', function (done) {
		var sc = sharedContext();
		var res = {locals: {}};
		sc({}, res, function () {
			assert(res.locals.context);
			done();
		});
	});

	it('should accept localsVar option', function (done) {
		var sc = sharedContext({
			localsVar: 'foobar'
		});
		var res = {locals: {}};
		sc({}, res, function () {
			assert(!res.locals.context);
			assert(res.locals.foobar);
			done();
		});
	});

	it('should load values from the window in the browser', function (done) {
		var sc = sharedContext({
			window: {
				__context: { foo: 'bar' }
			}
		});
		var res = {locals: {}};
		sc({}, res, function () {
			assert(res.locals.context);
			assert.equal(res.locals.context.foo, 'bar');
			done();
		});
	});

	it('should accept browserVar option', function (done) {
		var sc = sharedContext({
			browserVar: '__customVar',
			window: {
				__customVar: { foo: 'bar' }
			}
		});
		var res = {locals: {}};
		sc({}, res, function () {
			assert(res.locals.context);
			assert.equal(res.locals.context.foo, 'bar');
			done();
		});
	});

	it('should extend globals', function (done) {
		var sc = sharedContext({
			globals: {
				foo: 'bar',
				bar: 'foo'
			}
		});
		var res = { locals: {} };
		sc({}, res, function () {
			// Set as if in other middleware
			res.locals.context.bar = 'baz';
			res.locals.context.baz = 'far';

			assert(res.locals.context);
			assert.equal(res.locals.context.foo, 'bar');
			assert.equal(res.locals.context.bar, 'baz');
			assert.equal(res.locals.context.baz, 'far');
			done();
		});
	});

	it('should escape when passed to JSON.stringify', function (done) {
		var sc = sharedContext();
		var res = { locals: {} };
		sc({}, res, function () {
			res.locals.context.foo = '<script>alert("u ben haxed");</script>';

			var out = JSON.parse(JSON.stringify(res.locals.context));
			assert.equal(out.foo, '&lt;script&gt;alert(&quot;u ben haxed&quot;);&lt;/script&gt;');
			done();
		});
	});
});
