"use strict";
var Sequelize = require('sequelize');

module.exports.init = function(app, config, security, errors) {
	
	var Jam = app.get('models').Jam;
	var Video = app.get('models').Video;


	/**
	 *	Add Video to jam
	 */
	 app.post('/jams/:jamId/videos', security.authenticationRequired, function (req, res, next) {
		var postData = req.body;

		// check data
		if (!postData.video || postData.video.length == 0) {
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

			// create video
			Video.create({description: postData.description, instrument: postData.instrument, userId: req.user.id })
			.success(function (newVideo) {
				// TODO : save video file on the server
				jam.addVideos(newVideo)
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
	 *	Delete Video from jam
	 */
	 app.delete('/jams/:jamId/videos/:videoId', security.authenticationRequired, function (req, res, next) {

		// get video
		Video.find({ 
			where: { 
				id: req.params.videoId,
				jamId: req.params.jamId
			}
		}).success(function (video) {
			if (video == null) { return next(new errors.BadRequest('Video not found')); }

			// check if user can delete video
			Jam.find({
				where: {
					id: req.params.jamId
				}
			})
			.success(function (jam) {
				// jam owners can delete videos
				if (jam.userId == req.user.id || video.userId == req.user.id) {
					video.destroy()
					.success(function () {
						// TODO : delete file on the server
						res.send(200);	
					})
					.error(function (error) {
						return next(new errors.Error(error, 'Server error'));
					});
				} else {
					if (video == null) { return next(new errors.BadRequest('You cannot delete this video')); }
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
