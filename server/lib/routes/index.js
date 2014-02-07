"use strict";
var authentication = require('./authentication.js');
var jam = require('./jam.js');

module.exports.init = function(app, config, security, errors) {

	// serve app
	app.get('/', function (req, res, next) {
	    res.send('Server is running !');
	});

	authentication.init(app, config, security, errors);
	jam.init(app, config, security, errors);

}
