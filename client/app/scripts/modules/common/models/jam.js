/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');

    var JamModel = Backbone.Model.extend({

        defaults: {
            videos: {},
            admin: undefined,
            name: ""
        },

        initialize: function () {

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
