/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');

    var Comment = Backbone.Model.extend({

        defaults: {
            username: "anonymous",
            comment: ""
        },

        sync: function (method, model, options) {
            console.log('Comments::Method : ', method);

            if (method === 'create') {
                options.url = '/api/jams/' + options.jamId + '/comments';
            }

            return Backbone.sync(method, model, options);
        }

    });

    return Comment;
});