/*global define*/
define(function (require) {
    "use strict";

    var $ = require("jquery");
    var Backbone = require('backbone');
    var vent = require('modules/common/vent');
    var Video = require('modules/common/models/video');

    var VideoCollection = Backbone.Collection.extend({

        model: Video,

        save: function (options) {
            return this.sync("save", this, options);
        },

        sync: function (method, collection, options) {
            options = options || {};

            if (method === "save") {
                var promises = [];

                for (var i=0;i<collection.models.length;i++) {
                    promises.push(collection.models[i].save(null, { jamId: options.jamId }));
                }

                return $.when.apply($, promises);
            }
        }
    });

    return VideoCollection;
});
