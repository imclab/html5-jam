define(function (require) {

	var Backbone = require('backbone');

	var User = Backbone.Model.extend({

		defaults: {
			username: "Keyser Soze"
		}

	});

	return User;

});