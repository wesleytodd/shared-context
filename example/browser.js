var app = require('nighthawk')();

// Add the routes
require('./routes')(app);

app.listen();
