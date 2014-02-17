"use strict";

module.exports.init = function(app, config, security, errors) {

	// serve app
	app.get('/', function (req, res, next) {
	    res.send('Server is running !');
	});

	// init routes
	var routes = ['authentication', 'jam', 'user', 'comment', 'like', 'video', 'friend', 'note'];

	for (var i = 0; i < routes.length; i++) {
		require('./' + routes[i] + '.js').init(app, config, security, errors);
	}

}
