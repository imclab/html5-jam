/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');

    var Note = Backbone.Model.extend({

        defaults: {
            value: '',
            createdAt: '',
            userId: '',
            videoId: ''
        }

    });

    return Note;
});
