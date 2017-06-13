var setPrototypeOf = require('setprototypeof');
var escape = require('recursive-escape');
var unescape = require('recursive-unescape');
var _win = typeof window !== 'undefined' && window;

// Override toJSON so the data is escaped correctly for
// output in html, usually a script tag:
// <script>window.__context = <%- JSON.stringify(context) %></script>
var escapeProto = {
	toJSON: function () {
		return escape(this);
	}
};

module.exports = function setupSharedContext (_opts) {
	// Setup optional configuration
	var opts = _opts || {};

	// Allow overriding the window reference, mostly for testing
	var _window = opts.window || _win;

	// Configurable variable names
	var browserVar = opts.browserVar || '__context';
	var localsVar = opts.localsVar || 'context';
	var globalsVar = opts.globalsVar || '__$globals';

	// Globals should inherit from our escape json proto
	var globals;
	if (opts.globals) {
		globals = setPrototypeOf(opts.globals, escapeProto);
	} else {
		globals = Object.create(escapeProto);
	}

	// Keep global keys
	var globalKeys = Object.keys(globals);

	return function sharedContext (req, res, next) {
		// This is an isomorphic middleware, so this first step
		// is what is run in the browser to load the context
		// from what the backend passed to us
		if (_window && _window[browserVar]) {
			// Load up and unescape the values from the server, nulling out after
			res.locals[localsVar] = unescape(_window[browserVar]);
			_window[browserVar] = null;

			// Store/load in globals
			if (Array.isArray(res.locals[localsVar][globalsVar])) {
				res.locals[localsVar][globalsVar].forEach(function (key) {
					// Keep value
					globals[key] = globals[key] || res.locals[localsVar][key];

					// Ensure its in the keys array
					if (globalKeys.indexOf(key) === -1) {
						globalKeys.push(key);
					}
				});

				// Delete globals var once loaded
				delete res.locals[localsVar][globalsVar];
			}

			// Setup our new object to inherit the globals
			setPrototypeOf(res.locals[localsVar], globals);
		} else {
			// On the backend or after the initial
			// page load in a single page app,
			// we just initialize an empty object
			res.locals[localsVar] = Object.create(globals);

			// Track which keys should be persisted through route changes as globals,
			// non-configurable/modifiable but enumerable
			Object.defineProperty(res.locals[localsVar], globalsVar, {
				value: globalKeys,
				enumerable: true
			});
		}

		// Continue on good sir..
		next();
	};
};
