/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');
    var JamModel = require('modules/common/models/jam');

    var JamCollection = Backbone.Collection.extend({

        model: JamModel

    });

    return JamCollection;
});