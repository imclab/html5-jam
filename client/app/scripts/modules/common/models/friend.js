/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');

    var Friend = Backbone.Model.extend({

        defaults: {
            userId: '',
            friendId: ''
        },

        sync: function (method, model, options) {
            console.log('::SYNC:: Method [Friend] : ', method);

            if (method === 'create') {
                // follow a user
                options.url = '/api/users/' + model.attributes.friendId + '/follow';
            } else if (method === 'delete') {
                // unfollow a user
                options.url = '/api/users/' + model.attributes.friendId + '/follow';
            }

            return Backbone.sync(method, model, options);
        }

    });

    return Friend;
});
