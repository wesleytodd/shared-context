var setPrototypeOf = require('setprototypeof');
var escape = require('recursive-escape');
var unescape = require('recursive-unescape');

module.exports = function setupSharedContext (opts) {
	// Setup optional configuration
	opts = opts || {};
	opts.browserVar = opts.browserVar || '__context';
	opts.localsVar = opts.localsVar || 'context';

	return function sharedContext (req, res, next) {
		// This is an isomorphic middleware, so this first step
		// is what is run in the browser to load the context
		// from what the backend passed to us
		if (typeof window !== 'undefined' && window[opts.browserVar]) {
			res.locals[opts.localsVar] = unescape(window[opts.browserVar]);
			window[opts.browserVar] = null;
		} else {
			// On the backend or after the initial
			// page load in a single page app,
			// we just initialize an empty object
			res.locals[opts.localsVar] = {};
		}

		// Extend from globals
		if (opts.globals) {
			setPrototypeOf(res.locals[opts.localsVar], opts.globals);
		}

		// Override toJSON so the data is escaped correctly for
		// output in html, usually a script tag:
		// <script>window.__context = <%- JSON.stringify(context) %></script>
		res.locals[opts.localsVar].toJSON = function () {
			return escape(res.locals[opts.localsVar]);
		};

		// Continue on good sir..
		next();
	};
};
