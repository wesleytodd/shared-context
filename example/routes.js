var isBrowser = require('is-browser');
var sharedContext = require('../');

module.exports = function (app) {
	// Add the shared context middleware
	app.use(sharedContext({
		// Set a global variable.  This will be available
		// to all requests, and will be persisted in the
		// front-end if you use a compatible front-end router
		// with this middleware.
		globals: {
			name: 'Foo'
		}
	}));

	app.get('/', function (req, res, next) {
		// Set some data on the context,
		// in a real app this would come from
		// some api or other data source
		res.locals.context.title = res.locals.context.title || res.locals.context.name + '\'s Day at the Bar';
		res.locals.context.content = res.locals.context.content || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vitae tempus urna. Nulla tristique tincidunt nibh, eu fermentum risus consequat vitae. Pellentesque molestie leo vitae placerat lacinia. Sed et purus bibendum, dictum quam vitae, sollicitudin dolor. Nunc ut congue urna. Curabitur luctus nisi in eros luctus tincidunt. Nunc a orci quam. Vivamus tincidunt vel nulla vel molestie. Nulla facilisi. Morbi vel molestie massa. Etiam quis faucibus ligula.';
		next();
	}, render);

	app.get('/foo', function (req, res, next) {
		res.locals.context.title = res.locals.title || 'More about ' + res.locals.context.name;
		res.locals.context.content = res.locals.content || 'The entire starfleet couldn\'t destroy the whole planet. It\'d take a thousand ships with more fire power than I\'ve... There\'s another ship coming in. Maybe they know what happened. It\'s an Imperial fighter. It followed us! No. It\'s a short range fighter. There aren\'t any bases around here. Where did it come from? It sure is leaving in a big hurry. If they identify us, we\'re in big trouble. Not if I can help it. Chewie...jam it\'s transmissions. It\'d be as well to let it go. It\'s too far out of range. Not for long...';
		next();
	}, render);

	app.get('/bar', function (req, res, next) {
		res.locals.context.title = res.locals.title || 'The Bar';
		res.locals.context.content = res.locals.content || 'It\'s a dive.  ' + res.locals.context.name + ' loves it there.';
		next();
	}, render);
};

function render (req, res) {
	if (!isBrowser) {
		// Render the template on the backend
		res.render('index');
	} else {
		// Do browser type stuff, like bind events
		// or render a react applicaion
		document.getElementById('title').innerHTML = res.locals.context.title;
		document.getElementById('content').innerHTML = res.locals.context.content;

		console.log(res.locals.context);
	}
}
