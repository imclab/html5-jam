/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var vent = require('modules/common/vent');
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
            "click .sendbtn" : "sendComment",
            "keypress input[type='text']" : "sendCommentOnKeypress"
        },

        ui: {
            textarea: 'input'
        },

        initialize: function () {
            this.collection = new CommentCollection();
        },

        sendCommentOnKeypress: function (e) {
            if (e.keyCode === 13) {
                this.sendComment();
            }
        },

        sendComment: function () {
            if (this.ui.textarea.text !== "") {
                 vent.trigger('comment:new', this.ui.textarea.val());
            }
        },

        appendHtml: function (collectionView, itemView, index) {
            if (this.collection.models[0]) {
                index = this.compare(itemView.model, this.collection.models[0]) ? index : -index;
            }

            var childrenContainer = collectionView.itemViewContainer ? collectionView.$(collectionView.itemViewContainer) : collectionView.$el;
            var children = childrenContainer.children();
            if (children.size() <= index) {
                childrenContainer.append(itemView.el);
            } else {
                children.eq(index).before(itemView.el);
            }
        },

        compare: function (m1, m2) {
            return this.utc(m1) < this.utc(m2);
        },

        utc: function (model) {
            if (model.get("createdAt") === "") {
                return parseInt(moment().format("X"));
            }

            return parseInt(moment(model.get("createdAt")).format("X"));
        }

    });

    return CommentsView;

});
