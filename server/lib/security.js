"use strict";
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var utils = require('./utils');
var config = require('../config');
var Errors = null;
var User = null;

module.exports = {

	initialize: function (app, errors) {
		Errors = errors;
		User = app.get('models').User;

		// configure authentication strategy with Facebook
		passport.use(new FacebookStrategy(
		{
		    clientID: config.facebook.clientID,
		    clientSecret: config.facebook.clientSecret,
		    callbackURL: "http://localhost:" + config.server.port + "/auth/facebook/callback"
	 	}, 	function (accessToken, refreshToken, profile, done) {
		        User.login(profile, accessToken, done);
		    }
		));
		passport.serializeUser(function (user, done) {
		    done(null, user);
		});
		passport.deserializeUser(function (user, done) {
		    done(null, user);
		});
	},

	authenticate: function () {
		return passport.authenticate('facebook');
	},

	authenticationCallback: function () {
		return passport.authenticate('facebook', { failureRedirect: config.client.loginFailedUrl + config.client.port });
	},

	authenticationSuccessful: function (req, res) {
		res.redirect(config.client.loginSuccessUrl + config.client.port + '?token=' + utils.encrypt(req.user.facebook_token));
	},

	authenticationRequired: function (req, res, next) {
		// testing purpose
		User.find({limit: 1}).success(function (user) {
				if (user != null) {
					req.user = user;
					return next();
				} else {
					return next(new Errors.Unauthorized('User is not logged in'));
				}
		});

		// var token = req.headers.authorization;
		// if (token != null) {
		// 	User.find({where: {facebook_token: utils.decrypt(token)}}).success(function (user) {
		// 		if (user != null) {
		// 			req.user = user;
		// 			return next();
		// 		} else {
		// 			return next(new Errors.Unauthorized('User is not logged in'));
		// 		}
		// 	});
	 //    } else {
	 //        return next(new Errors.Unauthorized('User is not logged in'));
	 //    }
	}

};


