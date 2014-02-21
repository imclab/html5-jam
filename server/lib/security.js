"use strict";

var config = require('../config');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var users = require('./controllers/users');


exports.init = function () {

	// Use facebook strategy
	passport.use(new FacebookStrategy({
		    clientID: config.facebook.clientID,
		    clientSecret: config.facebook.clientSecret,
		    callbackURL: "http://localhost:" + config.server.port + "/auth/facebook/callback"
	 	}, 	function (accessToken, refreshToken, profile, done) {
		        users.login(profile, accessToken, done);
		    }
		));
		passport.serializeUser(function (user, done) {
		    return done(null, user);
		});
		passport.deserializeUser(function (user, done) {
		    return done(null, user);
	});

};
