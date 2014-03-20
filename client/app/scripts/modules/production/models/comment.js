/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');
    var AppData = require('modules/common/app_data');

    var Comment = Backbone.Model.extend({

        defaults: {
            content: '',
            createdAt: ''
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

    // override toJSON
    Comment.prototype.toJSON = function () {
        this.attributes.createdAt = moment(this.attributes.createdAt).fromNow();
        return this.attributes;
    };

    return Comment;
});