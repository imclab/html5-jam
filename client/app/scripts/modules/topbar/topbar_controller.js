define(function (require) {

	var $ 				= require('jquery');
	var Marionette 		= require('marionette');
	var vent 			= require('modules/common/vent');
	var TopBar 			= require('modules/topbar/views/topbar');
	var User 			= require('modules/common/models/user');
	var BaseController	= require('modules/common/controllers/base_controller');


	var TopbarController = BaseController.extend({
		
		initialize: function(options) {
			BaseController.prototype.initialize.call(this, options);
		},

		show: function () {
			BaseController.prototype.show.call(this);
		},

		getLayout: function () {
			return new TopBar( { model: new User() });
		}

	});

	return TopbarController;
});
