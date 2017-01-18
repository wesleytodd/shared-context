var setPrototypeOf = require('setprototypeof');
var escape = require('recursive-escape');
var unescape = require('recursive-unescape');

module.exports = function setupSharedContext (opts) {
	// Setup optional configuration
	opts = opts || {};
	opts.browserVar = opts.browserVar || '__context';
	opts.localsVar = opts.localsVar || 'context';

	// Override toJSON so the data is escaped correctly for
	// output in html, usually a script tag:
	// <script>window.__context = <%- JSON.stringify(context) %></script>
	var escapeProto = {
		toJSON: function () {
			return escape(this);
		}
	};

	// Globals should extend from our escape json proto
	if (opts.globals) {
		setPrototypeOf(opts.globals, escapeProto);
	}

	return function sharedContext (req, res, next) {
		// This is an isomorphic middleware, so this first step
		// is what is run in the browser to load the context
		// from what the backend passed to us
		if (typeof window !== 'undefined' && window[opts.browserVar]) {
			res.locals[opts.localsVar] = unescape(window[opts.browserVar]);
			window[opts.browserVar] = null;
			if (opts.globals) {
				setPrototypeOf(res.locals[opts.localsVar], opts.globals);
			}
		} else {
			// On the backend or after the initial
			// page load in a single page app,
			// we just initialize an empty object
			res.locals[opts.localsVar] = Object.create(opts.globals || escapeProto);
		}

		// Continue on good sir..
		next();
	};
};
