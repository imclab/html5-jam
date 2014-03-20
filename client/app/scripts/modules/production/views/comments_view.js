/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var vent = require('modules/common/vent');
    var CommentModel = require('modules/production/models/comment');
    var CommentCollection = require('modules/production/collections/comments');

    var CommentElement = Marionette.ItemView.extend({
        className: 'comment-element',

        template: 'production/comment_element',

        events: {
            "click .removeComment" : "removeComm"
        },

        removeComm: function () {
            vent.trigger('comment:remove', this.model);
        }
    });

    var CommentsView = Marionette.CompositeView.extend({

        className: 'view-wrapper',
        itemView: CommentElement,
        itemViewContainer: '.comments-list',
        template: 'production/comments',

        events: {
            "click .sendbtn" : "sendComment"
        },

        ui: {
            textarea: 'textarea'
        },

        initialize: function () {
            this.collection = new CommentCollection();
        },

        sendComment: function () {
            if (this.ui.textarea.text !== "") {
                vent.trigger('comment:new', this.ui.textarea.val());
            }
        }

    });

    return CommentsView;

});
