"use strict";
var Sequelize = require('sequelize');

module.exports.init = function(app, config, security, errors) {
	
	var User = app.get('models').User;
	var Jam = app.get('models').Jam;
	var Video = app.get('models').Video;
	var Comment = app.get('models').Comment;
	var Like = app.get('models').Like;


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

			Jam.create({ name: postData.name, description: postData.description, privacy: postData.privacy })
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
	 *	Update jam
	 */
	app.put('/jams/:jamId', security.authenticationRequired, function (req, res, next) {
		var postData = req.body;
	
		// get jam
		Jam.find({ 
			where: {
				id: req.params.jamId,
				userId: req.user.id
			} 
		})
		.success(function (jam) {
			if (jam == null) { return next(new errors.BadRequest('Jam not found')); }

			jam.name = postData.name || jam.name;
			jam.description = postData.description || jam.description;
			jam.privacy = postData.privacy || jam.privacy;
			
			jam.save(['name', 'description', 'privacy'])
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
	 *	Delete jam
	 */
	 app.delete('/jams/:jamId', security.authenticationRequired, function (req, res, next) {

		// get Jam
		Jam.find({ 
			where: { 
				id: req.params.jamId,
				userId: req.user.id
			}
		}).success(function (jam) {
			if (jam == null) { return next(new errors.BadRequest('Jam not found')); }

			// delete likes
			Like.destroy({
				jamId: jam.id
			});

			// delete comments
			Comment.destroy({
				jamId: jam.id
			});

			// delete jam
			jam.destroy()
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
	 *	Get jam details
	 */
	app.get('/jams/:jamId', security.authenticationRequired, function (req, res, next) {

		// get jam + owner info + number of likes in one request
		Jam.daoFactoryManager.sequelize.query('SELECT j.*, u.name as ownerName, u.facebook_id as ownerFacebookId, u.picture_url as ownerPictureUrl, count(l.id) as nbLikes'
		+ ' FROM jams j LEFT JOIN users u ON u.id=j.userId LEFT JOIN likes l ON l.jamId=j.id'
		+ ' WHERE j.id=? AND (j.privacy=0 OR j.userId=?)'
			, null, { raw: true }, [req.params.jamId, req.user.id])
		.success(function (rows) {
			if (rows == null || rows.length == 0 || rows[0].id == null) { return next(new errors.BadRequest('Jam not found')); }
			var jam = rows[0];

			// do I like it already ?
			Like.count({
				where: {
					jamId: jam.id,
					userId: req.user.id
				}
			})
			.success(function (result) {
				jam.doILikeIt = result > 0;

				Jam.daoFactoryManager.sequelize.query('SELECT v.id, v.description, v.instrument, v.createdAt, v.userId, u.name as ownerName, u.facebook_id as ownerFacebookId, u.picture_url as ownerPictureUrl'
				+ ' FROM videos v LEFT JOIN users u ON u.id=v.userId'
				+ ' WHERE v.jamId=? ORDER BY v.createdAt DESC'
					, null, { raw: true }, [req.params.jamId])
				.success(function (rows) {					
					jam.videos = rows;
					res.send(jam);
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
