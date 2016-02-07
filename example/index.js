var sharedContext = require('../');
var browserify = require('browserify-middleware');
var app = require('express')();
var ejs = require('consolidate').ejs;

app.engine('html', ejs);
app.set('view engine', 'html');
app.set('views', '.');

// Add the context middleware,
// Notice that the same middelware is added in browser.js
// In most of the apps that I work on I have a shared
// routes.js file that loads the common middleware
app.use(sharedContext());

app.get('/', function (req, res) {
	// Set some data on the context,
	// in a real app this would come from
	// some api or other data source
	res.locals.context.title = 'Foo\'s Day at the Bar';
	res.locals.context.content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vitae tempus urna. Nulla tristique tincidunt nibh, eu fermentum risus consequat vitae. Pellentesque molestie leo vitae placerat lacinia. Sed et purus bibendum, dictum quam vitae, sollicitudin dolor. Nunc ut congue urna. Curabitur luctus nisi in eros luctus tincidunt. Nunc a orci quam. Vivamus tincidunt vel nulla vel molestie. Nulla facilisi. Morbi vel molestie massa. Etiam quis faucibus ligula.';

	// Render the template
	res.render('index');
});

// Serve static assets
app.use('/static/browser.js', browserify(__dirname + '/browser.js'));

// Start server
app.listen('1234', function () {
	console.log('Listening on 1234');
});
