"use strict";

var multipart = require('connect-multiparty');
var authorization = require('./middlewares/authorization');
var videos = require('../controllers/videos');


module.exports.init = function (app) {


	/**
	 *	Add Video to jam
	 */
	 app.post('/jams/:jamId/videos', multipart(), authorization.requiresAuthentication, videos.addVideoToJam);


	 /**
	 *	Update Video
	 */
	 app.put('/jams/:jamId/videos/:videoId', authorization.requiresAuthentication, videos.updateVideo);


	/**
	 * 	Get video stream
	 */
	app.get('/jams/:jamId/videos/:videoId', authorization.requiresAuthentication, videos.getVideoStream);


	/**
	 *	Delete Video from jam
	 */
	 app.delete('/jams/:jamId/videos/:videoId', authorization.requiresAuthentication, videos.deleteVideoFromJam);


	 /**
	 *	Note a video
	 */
	 app.post('/jams/:jamId/videos/:videoId/notes', authorization.requiresAuthentication, videos.noteVideo);

	 
}
