define(function (require) {

	var Marionette = require('marionette');
	var UserModel = require('modules/common/models/user');

	var TopBar = Marionette.ItemView.extend({

		template: 'topbar'

	});

	return TopBar;

});