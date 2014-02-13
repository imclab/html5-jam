/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
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

        initialize: function () {
            this.collection = new Comment.CommentCollection();

            this.collection.add(new Comment.Comment({
                username: 'Mamy',
                comment: 'Coucou ! Cest mamy !'
            }));

            this.collection.add(new Comment.Comment({
                comment: 'Salut mamy !'
            }));
        }

    });

    return CommentsView;

});
