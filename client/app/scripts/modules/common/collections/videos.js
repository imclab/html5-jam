/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');
    var Video = require('modules/common/models/video');

    var VideoCollection = Backbone.Collection.extend({

        model: Video,

        save: function (options) {
            console.log('Collection Save : ', this);

            _.each(this.models, function (elem) {
                elem.save(null, {
                    jamId: options.jamId
                });
            });
        }
    });

    return VideoCollection;
});

