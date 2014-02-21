"use strict";

var passport = require('passport');
var config = require('../../config');
var Utils = require('../utils');


module.exports.init = function (app) {
    

    /**
    *	Facebook Login
    */
    app.get('/auth/facebook', passport.authenticate('facebook'));
	

    /**
    *	Facebook OAuth Callback
    */
	app.get('/auth/facebook/callback', passport.authenticate('facebook', { 
		failureRedirect: config.client.loginFailedUrl + config.client.port 
	}), function (req, res) {
		res.redirect(config.client.loginSuccessUrl + config.client.port + '#?token=' + Utils.encrypt(req.user.facebook_token));
	});


}
