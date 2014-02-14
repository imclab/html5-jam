/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var vent = require('modules/common/vent');
    var Comment = require('modules/production/models/comment');

    var CommentElement = Marionette.ItemView.extend({
        className: 'comment-element',

        template: 'production/comment_element'
    });

    var CommentsView = Marionette.CompositeView.extend({

        tagName: 'div',
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

        sendComment: function () {
            if (this.ui.textarea.text !== "") {
                vent.trigger('comment:new', this.ui.textarea.val());
            }
        },

        initialize: function () {
            this.collection = new Comment.CommentCollection();

            this.collection.add(new Comment.CommentModel({
                username: 'Mamy',
                comment: 'Coucou ! Cest mamy !'
            }));

            this.collection.add(new Comment.CommentModel({
                comment: 'Salut mamy !'
            }));
        }

    });

    return CommentsView;

});
