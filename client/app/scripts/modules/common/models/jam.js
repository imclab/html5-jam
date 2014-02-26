/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');

    var JamModel = Backbone.Model.extend({
        /* URL : /jam/:cid */
        defaults: {
            createdAt: '',
            description: '',
            id: 0,
            name: '',
            privacy: false,
            updatedAt: '',
            userId: 0
        }

    });


    return JamModel;

});
