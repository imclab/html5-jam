"use strict";
var authentication = require('./authentication.js');
var jam = require('./jam.js');
var user = require('./user.js');
var comment = require('./comment.js');
var comment = require('./index.js');

module.exports.init = function(app, config, security, errors) {

	// serve app
	app.get('/', function (req, res, next) {
	    res.send('Server is running !');
	});

	var routes = [];

	for (var i = 0; i < routes.length; i++) {
		
	}

	authentication.init(app, config, security, errors);
	jam.init(app, config, security, errors);
	user.init(app, config, security, errors);
	comment.init(app, config, security, errors);

}
