/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');

    var Comment = require('modules/production/models/comment');

    var CommentCollection = Backbone.Collection.extend({
        
        model: Comment

    });

    return CommentCollection;

});