"use strict";
var Sequelize = require('sequelize');

module.exports.init = function(app, config, security, errors) {
	
	var Jam = app.get('models').Jam;
	var like = app.get('models').like;


	/**
	 *	Post like to jam
	 */
	 app.post('/jams/:jamId/likes', security.authenticationRequired, function (req, res, next) {
		var postData = req.body;

		// check data
		if (!postData.content || postData.content.length == 0) {
			return next(new errors.BadRequest('Missing fields'));
		}

		// get jam
		Jam.find({ 
			where: Sequelize.and(
				{ id: req.params.jamId }, 
				Sequelize.or(
					{ privacy: 0 }, 
					{ userId: req.user.id }
				)
			) 
		}).success(function (jam) {
			if (jam == null) { return next(new errors.BadRequest('Jam not found')); }

			// create like
			like.create({ content: postData.content, userId: req.user.id, jamId: jam.id })
			.success(function (newlike) {
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
	 *	Delete like from jam
	 */
	 app.delete('/jams/:jamId/likes/:likeId', security.authenticationRequired, function (req, res, next) {

		// get like
		like.find({ 
			where: { 
				id: req.params.likeId,
				jamId: req.params.jamId,
				userId: req.user.id
			}
		}).success(function (like) {
			if (like == null) { return next(new errors.BadRequest('like not found')); }

			// delete like
			like.destroy()
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


}
