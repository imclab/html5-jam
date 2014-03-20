/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');
    var Utils = require('modules/common/utils');

    var Comment = Backbone.Model.extend({

        defaults: {
            ownerName: 'anonymous',
            content: '',
            createdAt: '',
            userId: null
        },

        initialize: function () {
            _.extend(this, Utils);
            this.attributes.createdAt = this.transformDate(this.attributes.createdAt);
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