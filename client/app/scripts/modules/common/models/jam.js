/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');

    var JamModel = Backbone.Model.extend({
        /* URL : /jam/:cid */
        defaults: {
            createdAt: '',
            description: '',
            name: '',
            privacy: false,
            updatedAt: '',
            userId: 0,
            ownerFacebookId: 0
        },

        sync: function (method, model, options) {
            console.log('::SYNC:: Method [Jam] : ', method);

            if (method === 'create') {
                // Create a jam
                options.url = '/api/jams';
            } else if (method === 'update') {
                // Update a jam
                options.url = '/api/jams/' + model.id;
            } else if (method === 'delete') {
                // Remove a jam
                options.url = '/api/jams/' + model.id;
            }

            return Backbone.sync(method, model, options);
        }

    });


    return JamModel;

});
