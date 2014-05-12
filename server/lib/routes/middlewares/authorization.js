'use strict';

var config = require('../../../config');
var Utils = require('../../utils');
var Errors = require('../../errors');

var users = require('../../controllers/users');


/**
 * Generic require login routing middleware
 */
exports.requiresAuthentication = function(req, res, next) {

    // testing purpose
    if (process.env.NODE_ENV == 'development' && req.query.debug != null) {
	    users.getUserById(1, function (user, err) {
	    	if (user != null) {
				req.user = user;
				return next();
			} else {
				return next(new Errors.Unauthorized('User does not exist'));
			}
	    });
		return;
	}
	

	if (req.cookies != null && req.cookies.jam_token != null) {
		users.getUserByToken(Utils.decrypt(req.cookies.jam_token), function (user, err) {
			if (err || user == null) {
				return next(new Errors.Unauthorized('User is not logged in'));
			} else {
				req.user = user;
				next();
			}
		});
  } else {
      return next(new Errors.Unauthorized('User is not logged in'));
  }

};
