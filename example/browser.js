/* global alert */
var app = require('nighthawk')();
var sharedContext = require('../');

// Add the context middelware
app.use(sharedContext());

app.get('/', function (req, res) {
	// Do browser type stuff, like bind events
	// or render a react applicaion
	alert(res.locals.context.title);
});

app.listen();
