/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');

    var Like = Backbone.Model.extend({

        defaults: {
            userId: '',
            jamId: ''
        },

        sync: function (method, model, options) {
            console.log('::SYNC:: Method [Like] : ', method);

            if (method === 'create') {
                // Like a jam
                options.url = '/api/jams/' + model.attributes.jamId + '/likes';
            } else if (method === 'delete') {
                // Dislike a jam
                options.url = '/api/jams/' + model.attributes.jamId + '/likes';
            }

            return Backbone.sync(method, model, options);
        }

    });

    return Like;
});
