"use strict";

module.exports.init = function(db) {

	// load models
	var models = ['User', 'Jam', 'Video', 'Like', 'Comment', 'Note', 'Friend'];

	models.forEach(function (model) {
	    module.exports[model] = db.import(__dirname + '/' + model);
	});

}
