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
            textarea: 'input'
        },

        initialize: function () {
            this.collection = new CommentCollection();
        },

        sendComment: function () {
            if (this.ui.textarea.text !== "") {
                vent.trigger('comment:new', this.ui.textarea.val());
            }
        },

        initFILO: function () {
            this.appendHtml = function (collectionView, itemView, index){
                index = -index;

                var childrenContainer = collectionView.itemViewContainer ? collectionView.$(collectionView.itemViewContainer) : collectionView.$el;
                var children = childrenContainer.children();
                if (children.size() <= index) {
                    childrenContainer.append(itemView.el);
                } else {
                    children.eq(index).before(itemView.el);
                }
            }
        }

    });

    return CommentsView;

});
