/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');

    var Stamp = Backbone.Model.extend({

        defaults: {
            username: "anonymous",
            thumb: ""
        }

    });

    var StampCollection = Backbone.Collection.extend({
        model: Stamp
    });

    return {
        StampModel: Stamp,
        StampCollection: StampCollection
    };

});