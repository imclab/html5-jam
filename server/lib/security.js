"use strict";
var express = require('express');
var passport = require('passport');
var crypto = require('crypto');
var FacebookStrategy = require('passport-facebook').Strategy;
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
		res.redirect(config.client.loginSuccessUrl + config.client.port + '?token=' + encrypt(req.user.facebook_token));
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
		// 	User.find({where: {facebook_token: decrypt(token)}}).success(function (user) {
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


function encrypt(data) {
	var cipher = crypto.createCipher(config.crypto.algorithm, config.crypto.key);  
	return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
}

function decrypt(data) {
	var decipher = crypto.createDecipher(config.crypto.algorithm, config.crypto.key);
	return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
}
