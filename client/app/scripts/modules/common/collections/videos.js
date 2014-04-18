/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');
    var Video = require('modules/common/models/video');

    var VideoCollection = Backbone.Collection.extend({

        model: Video,
// TODO SAVE FUNCTION WITH Promise PLZ
        save: function (options) {
            console.log("Coucou les guignols : ", _.clone(this));
            this.sync("save", this.models, options);
        },

        sync: function (method, collection, options) {
            options = options || {};

            if (method === "save") {
                this.each(function (model) {
                    model.save(null, {
                        jamId: options.jamId
                    });
                });
            }
        }
    });

    return VideoCollection;
});
