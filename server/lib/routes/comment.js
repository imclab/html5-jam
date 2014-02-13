"use strict";
var Sequelize = require('sequelize');

module.exports.init = function(app, config, security, errors) {
	
	var Jam = app.get('models').Jam;
	var Comment = app.get('models').Comment;


	/**
	 *	Post Comment to jam
	 */
	 app.post('/jams/:jamId/comments', security.authenticationRequired, function (req, res, next) {
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

			// create comment
			Comment.create({ content: postData.content, userId: req.user.id, jamId: jam.id })
			.success(function (newComment) {
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
	 *	Delete Comment from jam
	 */
	 app.delete('/jams/:jamId/comments/:commentId', security.authenticationRequired, function (req, res, next) {

		// get comment
		Comment.find({ 
			where: { 
				id: req.params.commentId,
				jamId: req.params.jamId,
				userId: req.user.id
			}
		}).success(function (comment) {
			if (comment == null) { return next(new errors.BadRequest('Comment not found')); }

			// delete comment
			comment.destroy()
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
