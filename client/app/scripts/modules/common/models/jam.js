/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');

    var JamModel = Backbone.Model.extend({
        /* URL : /jam/:cid */
        defaults: {
            videos: {},
            name: ''
        }
    });

    var JamCollection = Backbone.Collection.extend({

        model: JamModel

    });

    return {
        JamModel: JamModel,
        JamCollection: JamCollection
    };

});
