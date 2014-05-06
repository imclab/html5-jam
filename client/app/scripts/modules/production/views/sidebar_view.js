/*global define*/
define(function (require) {
    "use strict";

    var vent = require('modules/common/vent');
    var Marionette = require('marionette');
    var VideoModel = require('modules/common/models/video');
    var VideoCollection = require('modules/common/collections/videos');

    var SideBarElement = Marionette.CompositeView.extend({
        template: 'production/sidebar_element',

        className: 'video-player',

        events: {
            'click .delete-video' : '_remove',
            'click .play-video' : 'play',
            'click .mute-video' : 'mute'
        },

        ui: {
            muteBtn : '.mute-video',
            muteBtnIcon : '.mute-video span',
            videoContainer : '.video-container'
        },

        onShow: function () {
            this.controller = document.getElementById('video-player-' + this.model.cid);
        },

        play: function () {
            this.controller.play();
        },

        mute: function () {
            this.controller.muted = !this.controller.muted;
            this.ui.muteBtn.toggleClass('btn-success btn-warning');
            this.ui.muteBtnIcon.toggleClass('glyphicon-volume-off glyphicon-volume-up');
        },

        _remove: function () {
            vent.trigger('player:remove', this.model);
            this.remove();
        }
    });

    var SideBarView = Marionette.CompositeView.extend({

        tagName: 'div',

        className: 'view-wrapper',

        itemView: SideBarElement,

        itemViewContainer: '.videos-list',

        template: 'production/sidebar',

        initialize: function () {
            this.collection = new VideoCollection();
        }

    });

    return SideBarView;

});
