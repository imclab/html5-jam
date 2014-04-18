/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');
    var vent = require('modules/common/vent');
    var Video = require('modules/common/models/video');

    var VideoCollection = Backbone.Collection.extend({

        model: Video,

        save: function (options) {
            this.sync("save", this.models, options);
        },

        sync: function (method, collection, options) {
            options = options || {};

            var deliveredVideoSuccess = 0;
            var deliveredVideoFail = 0;

            if (method === "save") {

                if (_.isArray(collection)) {
                    if (!options.deferred) {
                        console.log("Unespected call of videos.save, you should use a deferred in options.");
                    }

                    for (var i=0;i<collection.length;i++) {
                        collection[i].save(null, {
                            jamId: options.jamId,
                            success: function () {
                                console.log("Video saved");
                                deliveredVideoSuccess++;
                                if (deliveredVideoFail + deliveredVideoSuccess >= collection.length) {
                                    options.deferred.resolve();
                                }
                            },
                            error: function () {
                                console.log("Video rejected");
                                deliveredVideoFail++;
                                if (deliveredVideoFail + deliveredVideoSuccess >= collection.length) {
                                    options.deferred.resolve();
                                }
                            }
                        });
                    }
                }
            }
        }
    });

    return VideoCollection;
});
