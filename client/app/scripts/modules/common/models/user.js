define(function (require) {

    var Backbone = require('backbone');

    var User = Backbone.Model.extend({

        defaults: {
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

    // override toJSON
    User.prototype.toJSON = function() {
        this.attributes.createdAt = moment(this.attributes.createdAt).fromNow();
        return this.attributes;
    };

    return User;
});