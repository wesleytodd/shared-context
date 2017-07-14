var browserify = require('browserify-middleware');
var app = require('express')();
var ejs = require('consolidate').ejs;

app.engine('html', ejs);
app.set('view engine', 'html');
app.set('views', '.');

require('./routes')(app);

// Serve static assets
app.use('/static/browser.js', browserify(__dirname + '/browser.js'));

// Start server
app.listen('1234', function () {
	console.log('Listening on 1234');
});
