# Shared Data Context for Node and the Browser

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status](https://travis-ci.org/wesleytodd/shared-context.svg?branch=master)](https://travis-ci.org/wesleytodd/shared-context)
[![js-happiness-style](https://img.shields.io/badge/code%20style-happiness-brightgreen.svg)](https://github.com/JedWatson/happiness)

[npm-image]: https://img.shields.io/npm/v/shared-context.svg
[npm-url]: https://npmjs.org/package/shared-context
[downloads-image]: https://img.shields.io/npm/dm/shared-context.svg
[downloads-url]: https://npmjs.org/package/shared-context

This module provides a middleware which is easily used to share data between the front and back end.  The data is properly escaped for insertion directly into the html of a page to protect you against script injection attacks.  This is a common pattern used for applications that have heavy front-end javascript components like React or Angular apps.

If you are using an isomorphic router pattern, like the [Express](https://www.npmjs.com/package/express) with [Nighthawk](https://www.npmjs.com/package/nighthawk), you can use this middleware on both sides and it will handle the data loading for you.  Check out the example for more details on this pattern.

## Usage

```
$ npm install --save shared-context
```

```javascript
// index.js

var app = require('express')();
var sharedContext = require('shared-context');

app.use(sharedContext({
	// Options and their defaults
	// browserVar: '__context'
	// localsVar: 'context'
}));

app.get('/', function (req, res) {
	// Set some data on the context,
	// in a real app this would come from
	// some api or other data source
	res.locals.context.title = 'Foo\'s Day at the Bar';

	// Render the template
	res.render('index');
});
```

```html
<html>
	<!-- other stuff in here -->
	<script>
		__context = <%- JSON.stringify(context) %>
	</script>
	<script src="/browser.js"></script>
</html>
```

```javascript
// browser.js

var app = require('nighthawk')();
var sharedContext = require('shared-context');

app.use(sharedContext());

app.get('/', function (req, res) {
	// Do browser type stuff, like bind events
	// or render a react applicaion
	console.log(res.locals.context.title); // 'Foo\'s Day at the Bar'
});
```
