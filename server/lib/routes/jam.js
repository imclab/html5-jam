"use strict";
var httpreq = require('httpreq');

module.exports.init = function(app, config, security, errors) {
	
	var User = app.get('models').User;
	var Jam = app.get('models').Jam;
	var Video = app.get('models').Video;

	 /**
	 *	Get all my jams
	 */
	app.get('/jams', security.authenticationRequired, function (req, res, next) {
		// get user's organizations
		User.find({ where: {facebook_token: req.user.facebook_token}, include: [Jam] })
			.success(function (user) {
				if (user == null) { return next(new errors.BadRequest('User not found')); }
				res.send(user.jams);
			})
			.error(function (error) {
				return next(new errors.Error(error, 'Server error'));
			});
	});


	/**
	 *	Create new jam
	 */
	app.post('/jams', security.authenticationRequired, function (req, res, next) {
		var postData = req.body;

		// check data
		if (!postData.name || postData.name.length == 0) {
			return next(new errors.BadRequest('Missing fields'));
		}

		// get user
		User.find({ where: {facebook_token: req.user.facebook_token} })
		.success(function (user) {
			if (user == null) { return next(new errors.BadRequest('User not found')); }
			Jam.create({ name: postData.name, description: postData.description, private: postData.private })
			.success(function (newJam) {
				user.addJam(newJam)
				.success(function () {
					res.send(200);
				})
				.error(function (error) {
					return next(new errors.Error(error, 'Server error'));
				});
			})
			.error(function (error) {
				return next(new errors.Error(error, 'Server error'));
			});
		})
		.error(function (error) {
			return next(new errors.Error(error, 'Server error'));
		});
	});


	/**
	 *	Get jam details
	 */
	app.get('/jams/:id', security.authenticationRequired, function (req, res, next) {
		// get user
		User.find({ where: {facebook_token: req.user.facebook_token} })
		.success(function (user) {
			if (user == null) { return next(new errors.BadRequest('User not found')); }

			// get jams
			user.getJams({ where: {id: req.params.id} })
			.success(function (jams) {
				if (jams == null || jams.length == 0) { 
					return next(new errors.BadRequest('Jam not found')); 
				} else {
					res.send(organizations[0]);
				}
			})
			.error(function (error) {
				return next(new errors.Error(error, 'Server error'));
			});
		})
		.error(function (error) {
			return next(new errors.Error(error, 'Server error'));
		});
	});

}
