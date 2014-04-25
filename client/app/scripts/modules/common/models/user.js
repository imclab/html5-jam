define(function (require) {

    var Backbone = require('backbone');
    var moment = require('moment');

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
            vignette_two: null,
            createdAt: '',
            doIFollowHim: false
        },

        toJSON: function () {
            var data = Backbone.Model.prototype.toJSON.call(this);

            data.createdAt = moment(data.createdAt).fromNow();

            return data;
        }

    });

    return User;
});