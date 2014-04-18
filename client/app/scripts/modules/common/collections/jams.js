/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');
    var JamModel = require('modules/common/models/jam');

    var JamCollection = Backbone.Collection.extend({

        model: JamModel,

        url: "/api/feeds/",

        sync: function (method, collection, options) {
            // console.log('::SYNC:: Method [Jams] : ', arguments);
            options = options || {};

            if (method === "read") {
                options.url = this.url;

                return Backbone.sync(method, collection, options);
            }
        }

    });

    return JamCollection;
});
