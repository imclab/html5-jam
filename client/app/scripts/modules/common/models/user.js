define(function (require) {

    var Backbone = require('backbone');

    var User = Backbone.Model.extend({

        defaults: {
            createdAt: '',
            facebook_id: '',
            email: '',
            jams: [],
            name: '',
            picture_url: '',
            id: null,
            vignette_one: null,
            vignette_three: null,
            vignette_two: null
	    }

    });

    return User;
});