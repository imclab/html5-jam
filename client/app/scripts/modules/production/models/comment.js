/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');

    var Comment = Backbone.Model.extend({

        defaults: {
            ownerName: 'anonymous',
            content: '',
            createdAt: ''
        },

        initialize: function () {
            this.set('createdAt', new Date());
        },

        sync: function (method, model, options) {
            console.log('::SYNC:: Method [Comments] : ', method);

            if (method === 'create') {
                options.url = '/api/jams/' + options.jamId + '/comments';
            } else if (method === 'delete') {
                options.url = '/api/jams/' + options.jamId + '/comments/' + this.id;
            }

            return Backbone.sync(method, model, options);
        }

    });

    return Comment;
});