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

    var CommentCollection = Backbone.Collection.extend({
        model: Comment
    });

    return {
        Comment: Comment,
        CommentCollection: CommentCollection
    };

});