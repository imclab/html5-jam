"use strict";
var Sequelize = require('sequelize');

module.exports.init = function(app, config, security, errors) {
	
	var Jam = app.get('models').Jam;
	var Note = app.get('models').Note;


	/**
	 *	Note a video
	 */
	 app.post('/jams/:jamId/videos/:videoId/note', security.authenticationRequired, function (req, res, next) {
	 	var postData = req.body;

		// check data
		if (!postData.value || postData.value.length == 0 || postData.value > 5 || postData.value < 1) {
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

			// create / update note
			Note.findOrCreate({ userId: req.user.id, videoId: req.params.videoId })
			.success(function (note) {
				note.value = postData.value;
				note.save()
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

}
