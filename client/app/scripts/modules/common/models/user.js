define(function (require) {

	var Backbone = require('backbone');

	var User = Backbone.Model.extend({

		defaults: {
			username: "anonymous"
		},

        parse: function (response) {
            return {
                username: response.name
            };
        },

        sync: function (method, model, options) {
            _.extend(options, {url: '/api/me'});

            return Backbone.sync.apply(this, arguments);
        }

	});

	return User;

});