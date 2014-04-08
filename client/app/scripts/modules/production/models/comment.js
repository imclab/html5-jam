/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');
    var moment = require('moment');

    var Comment = Backbone.Model.extend({

        defaults: {
            content: '',
            createdAt: '',
            userId: ''
        },

        sync: function (method, model, options) {
            console.log('::SYNC:: Method [Comments] : ', method);

            if (method === 'create') {
                options.url = '/api/jams/' + options.jamId + '/comments';
            } else if (method === 'delete') {
                options.url = '/api/jams/' + options.jamId + '/comments/' + this.id;
            }

            return Backbone.sync(method, model, options);
        },

        toJSON: function () {
            var data = Backbone.Model.prototype.toJSON.call(this);

            _.extend(data, {
                createdAt: moment(this.get("createdAt")).fromNow()
            });

            return data;
        }

    });

    return Comment;
});