"use strict";
var Sequelize = require('sequelize');

module.exports.init = function(app, config, security, errors) {
	
	var User = app.get('models').User;
	var Friend = app.get('models').Friend;


	/**
	*	Get a user's friends
	*/
	app.get('/users/:userId/friends', security.authenticationRequired, function (req, res, next) {

		var pagination = req.query.pagination || 20;
		if (pagination <= 0) { pagination = 20; }
		var page = req.query.page || 1;
		if (page <= 0) { page = 1; }
		
		Friend.daoFactoryManager.sequelize.query('SELECT f.id, u.name, u.facebook_id, u.picture_url, u.vignette_one, u.vignette_two, u.vignette_three'
		+ ' FROM friends f LEFT JOIN users u ON u.id=f.friendId'
		+ ' WHERE f.userId=? ORDER BY f.createdAt DESC LIMIT ' + (page == 1 ? 0 : ((page - 1) * pagination + 1)) + ',' + pagination
			, null, { raw: true }, [req.params.userId])
		.success(function (rows) {

			var result = {
				pagination: pagination,
				page: page,
				friends: rows
			}
			res.send(result);
		})
		.error(function (error) {
			return next(new errors.Error(error, 'Server error'));
		});

	});



	/**
	 *	Follow user
	 */
	 app.post('/users/:userId/follow', security.authenticationRequired, function (req, res, next) {

		// get both users
		User.findAll({ 
			where: Sequelize.or(
				{ id: req.params.userId }, 
				{ id: req.user.id }
			) 
		}).success(function (users) {
			console.log(users)
			if (users == null || users.length != 2) { return next(new errors.BadRequest('User not found')); }

			// add relationship
			Friend.findOrCreate({ userId: req.user.id, friendId: req.params.userId })
			.success(function (newFriend) {
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
	 *	Unfollow user
	 */
	 app.post('/users/:userId/unfollow', security.authenticationRequired, function (req, res, next) {

		// get Friend
		Friend.destroy({
			where: {
				userId: req.user.id,
				friendId: req.params.userId
			}
		}).success(function () {
			res.send(200);
		})
		.error(function (error) {
			return next(new errors.Error(error, 'Server error'));
		});
	});


}
