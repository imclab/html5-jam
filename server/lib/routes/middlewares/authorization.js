'use strict';

var Utils = require('../../utils');
var Errors = require('../../errors');

var users = require('../../controllers/users');


/**
 * Generic require login routing middleware
 */
exports.requiresAuthentication = function(req, res, next) {

    // testing purpose
	// User.find({where: {id: 100}}).success(function (user) {
	// 		if (user != null) {
	// 			req.user = user;
	// 			return next();
	// 		} else {
	// 			return next(new Errors.Unauthorized('User is not logged in'));
	// 		}
	// });
	// return;

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
