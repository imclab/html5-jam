/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');
    var Video = require('modules/common/models/video');

    var VideoCollection = Backbone.Collection.extend({

        model: Video,

        save: function (options) {
            this.each(function (model) {
                model.save(null, {
                    jamId: options.jamId
                });
            });
        }
    });

    return VideoCollection;
});
