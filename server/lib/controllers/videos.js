'use strict';

var logger = require('winston');
var Sequelize = require('sequelize');
var Errors = require('../errors');
var Utils = require('../utils');
var Models = require('../models');

var Jam = Models.Jam;
var Video = Models.Video;
var Note = Models.Note;


exports.addVideoToJam = function (req, res, next) {
	
	var postData = req.body;

	// check data
	if (!postData || !postData.video || postData.video.length == 0 || !postData.audio || postData.audio.length == 0) {
		return next(new Errors.BadRequest('Missing fields'));
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
		if (jam == null) { return next(new Errors.BadRequest('Jam not found')); }

		// create video
		Video.create({ instrument: postData.instrument, userId: req.user.id, active: postData.active, volume: postData.volume })
		.success(function (newVideo) {
			// save the video file to disk
		    var videoFileBuffer = new Buffer(postData.video.contents.split(',').pop(), 'base64');
			Utils.writeFileToDisk(req.params.jamId + '/' + newVideo.id + '.webm', videoFileBuffer, function (err) {
				if (err) {
					return next(new Errors.Error(err, 'Server error'));
				} else {
					// save the audio file to disk
				    var audioFileBuffer = new Buffer(postData.audio.contents.split(',').pop(), 'base64');
					Utils.writeFileToDisk(req.params.jamId + '/' + newVideo.id + '.wav', audioFileBuffer, function (err) {
						if (err) {
							return next(new Errors.Error(err, 'Server error'));
						} else {
							// merge audio and video
							Utils.mergeAudioVideo(req.params.jamId + '/' + newVideo.id);

							// add relation
							jam.addVideos(newVideo)
							.success(function () {
								res.send(newVideo);
							})
							.error(function (error) {
								return next(new Errors.Error(error, 'Server error'));
							});
						}
					});
				}
			});
		})
		.error(function (error) {
			return next(new Errors.Error(error, 'Server error'));
		});
	})
	.error(function (error) {
		return next(new Errors.Error(error, 'Server error'));
	});

};

exports.updateVideo = function (req, res, next) {
	
	var postData = req.body;

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
		if (jam == null) { return next(new Errors.BadRequest('Jam not found')); }

		// get video
		Video.find({
			where: { id: req.params.videoId }
		})
		.success(function (video) {
			if (video == null) { return next(new Errors.BadRequest('Video not found')); }

			// update video
			video.instrument = postData.instrument || video.instrument;
			video.active = postData.active || video.active;
			video.volume = postData.volume || video.volume;

			// save video
			video.save()
			.success(function () {
				res.send(video);
			})
			.error(function (error) {
				return next(new Errors.Error(error, 'Server error'));
			});
		})
		.error(function (error) {
			return next(new Errors.Error(error, 'Server error'));
		});
	})
	.error(function (error) {
		return next(new Errors.Error(error, 'Server error'));
	});

};

exports.getVideoStream = function (req, res, next) {

	// get jam
	Jam.find({ 
		where: Sequelize.and(
			{ id: req.params.jamId }, 
			Sequelize.or(
				{ privacy: 0 }, 
				{ userId: req.user.id }
			)
		) 
	})
	.success(function (jam) {
		if (jam == null) { return next(new Errors.BadRequest('Jam not found')); }

		jam.getVideos({
			where: {
				id: req.params.videoId
			}
		})
		.success(function (videos) {
			if (videos == null || videos.length == 0) { return next(new Errors.BadRequest('Video not found')); }

			Utils.readFileFromDisk(req.params.jamId + '/' + req.params.videoId + '.webm', function (error, file) {
				if (error) {
					return next(new Errors.BadRequest('Video not found'));
				} else {
					var range = req.headers.range;

					if (range) {
						// partial content request
						var length = file.length;
						var positions = range.replace(/bytes=/, '').split('-');
						var start = parseInt(positions[0], 10);
						var end = positions[1] ? parseInt(positions[1], 10) : length - 1;
						var chunksize = end - start + 1;
					  res.writeHead(206, { 	
					  	'Content-Range': 'bytes ' + start + '-' + end + '/' + length, 
              'Accept-Ranges': 'bytes',
              'Content-Length': chunksize,
              'Content-Type':'video/webm'
            });
					  res.end(file.slice(start, end + 1), 'binary');
					} else {
						// whole video request
						res.writeHead(200, {'Content-Type': 'video/mpeg' });
						res.end(file, 'binary');	
					}
				}
			});
		})
		.error(function (error) {
			return next(new Errors.Error(error, 'Server error'));
		});
	})
	.error(function (error) {
		return next(new Errors.Error(error, 'Server error'));
	});

};

exports.deleteVideoFromJam = function (req, res, next) {

	// get video
	Video.find({ 
		where: { 
			id: req.params.videoId,
			jamId: req.params.jamId
		}
	}).success(function (video) {
		if (video == null) { return next(new Errors.BadRequest('Video not found')); }

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
					Utils.deleteFileFromDisk(req.params.jamId + '/' + req.params.videoId + '.webm', function (error) {
						if (error) {
							return next(new Errors.BadRequest('Video not found'));
						} else {
							res.send(200);	
						}
					})
				})
				.error(function (error) {
					return next(new Errors.Error(error, 'Server error'));
				});
			} else {
				if (video == null) { return next(new Errors.BadRequest('You cannot delete this video')); }
			}
		})
		.error(function (error) {
			return next(new Errors.Error(error, 'Server error'));
		});

	})
	.error(function (error) {
		return next(new Errors.Error(error, 'Server error'));
	});

};

exports.noteVideo = function (req, res, next) {

 	var postData = req.body;

	// check data
	if (!postData.value || postData.value.length == 0 || postData.value > 5 || postData.value < 1) {
		return next(new Errors.BadRequest('Missing fields'));
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
		if (jam == null) { return next(new Errors.BadRequest('Jam not found')); }

		// create / update note
		Note.findOrCreate({ userId: req.user.id, videoId: req.params.videoId })
		.success(function (note) {
			note.value = postData.value;
			note.save()
			.success(function () {
				res.send(200);
			})
			.error(function (error) {
				return next(new Errors.Error(error, 'Server error'));
			});
		})
		.error(function (error) {
			return next(new Errors.Error(error, 'Server error'));
		});
	})
	.error(function (error) {
		return next(new Errors.Error(error, 'Server error'));
	});

};
