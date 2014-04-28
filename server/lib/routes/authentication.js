"use strict";

var passport = require('passport');
var config = require('../../config');
var Utils = require('../utils');


module.exports.init = function (app) {
    

    /**
    *	Facebook Login
    *    @param: {Object} [cfg] an object
    */
    app.get('/auth/facebook', passport.authenticate('facebook'));
	

    /**
    *	Facebook OAuth Callback
    */
	app.get('/auth/facebook/callback', passport.authenticate('facebook', { 
		failureRedirect: config.client.baseUrl + config.client.port 
	}), function (req, res) {
		res.redirect(config.client.baseUrl + config.client.port + '#?token=' + Utils.encrypt(req.user.facebook_token));
	});


    /**
    *   Logout
    */
    app.post('/logout', function (req, res) {
        res.clearCookie('jam_token');
        res.send(200);
    });


}
