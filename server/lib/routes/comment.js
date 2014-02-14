"use strict";
var Sequelize = require('sequelize');

module.exports.init = function(app, config, security, errors) {
	
	var Comment = app.get('models').Comment;
	var Jam = app.get('models').Jam;


	/**
	 *	Get jam's comments
	 */
	app.get('/jams/:jamId/comments', security.authenticationRequired, function (req, res, next) {

		var pagination = req.query.pagination || 20;
		if (pagination <= 0) { pagination = 20; }
		var page = req.query.page || 1;
		if (page <= 0) { page = 1; }

		// get comments + user info
		Comment.daoFactoryManager.sequelize.query('SELECT c.id, c.content, c.createdAt, c.userId, u.name as ownerName, u.facebook_id as ownerFacebookId, u.picture_url as ownerPictureUrl'
		+ ' FROM comments c LEFT JOIN users u ON u.id=c.userId LEFT JOIN jams j ON c.jamId=j.id'
		+ ' WHERE c.jamId=? AND (j.privacy=0 OR j.userId=?) ORDER BY c.createdAt DESC LIMIT ' + (page - 1) * pagination + ',' + page * pagination
			, null, { raw: true }, [req.params.jamId, req.user.id])
		.success(function (rows) {
			if (rows == null || rows.length == 0 || rows[0].id == null) { return next(new errors.BadRequest('No results')); }
			
			var result = {
				pagination: pagination,
				page: page,
				lastPage: Math.ceil(rows.length / pagination),
				comments: rows
			}
			res.send(result);
		})
		.error(function (error) {
			return next(new errors.Error(error, 'Server error'));
		});

	});


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
