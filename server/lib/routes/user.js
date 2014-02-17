"use strict";
var Sequelize = require('sequelize');

module.exports.init = function(app, config, security, errors) {
	
	var User = app.get('models').User;
	var Jam = app.get('models').Jam;
	var Comment = app.get('models').Comment;
	var Video = app.get('models').Video;
	var Friend = app.get('models').Friend;


	/**
	*	Get a user profile
	*/
	app.get('/users/:userId', security.authenticationRequired, function (req, res, next) {
		// get user's organizations
		User.find(
			{ 
				where: { 
					id: req.params.userId 
				}, 
				attributes: ['name', 'picture_url', 'facebook_id', 'createdAt', 'vignette_one', 'vignette_two', 'vignette_three'], 
				include: [{ 
					model: Jam, 
					where: Sequelize.or({ 
						privacy: 0 
					}, 
					{ 
						userId: req.user.id 
					}) 
				}]
			})
			.success(function (user) {
				if (user == null) { return next(new errors.BadRequest('User not found')); }

				res.send(user);
			})
			.error(function (error) {
				return next(new errors.Error(error, 'Server error'));
			});
	});


	/**
	*	Update user
	*/
	app.put('/users/:userId', security.authenticationRequired, function (req, res, next) {
		var postData = req.body;
	
		// get user
		User.find({ 
			where: {
				id: req.user.id
			} 
		})
		.success(function (user) {
			if (user == null) { return next(new errors.BadRequest('User not found')); }

			user.vignette_one = postData.vignette_one || user.vignette_one;
			user.vignette_two = postData.vignette_two || user.vignette_two;
			user.vignette_three = postData.vignette_three || user.vignette_three;
			
			user.save(['vignette_one', 'vignette_two', 'vignette_three'])
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
	});


	/**
	*	Delete account
	*/
	app.delete('/users/:userId', security.authenticationRequired, function (req, res, next) {
		// get user
		User.find(
			{ 
				where: { 
					id: req.params.userId 
				}
			})
			.success(function (user) {
				if (user == null) { return next(new errors.BadRequest('User not found')); }

				// delete videos
				Video.destroy({
					userId: req.user.id
				});

				// delete comments
				Comment.destroy({
					userId: req.user.id
				});

				// hide all jams
				Jam.update({
					privacy: 1
				}, {
					userId: req.user.id
				});

				// delete user
				user.destroy()
				.success(function () {
					res.send(200);	
				})
			})
			.error(function (error) {
				return next(new errors.Error(error, 'Server error'));
			});
	});

};