/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');

    var Comment = Backbone.Model.extend({

        defaults: {
            username: "anonymous",
            comment: ""
        }

    });

    return Comment;

});