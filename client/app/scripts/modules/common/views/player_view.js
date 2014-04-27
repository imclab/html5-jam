/*global define*/
/*global window*/
define(function (require) {
    'use strict';

    var Marionette = require('marionette');
    var vent = require('modules/common/vent');

    var PlayerView = Marionette.ItemView.extend({

        template: 'common/video_player',

        className: 'video-player',

        events: {
            'click .delete-video' : '_remove',
            'click .play-video' : 'play',
            'click .mute-video' : 'mute'
        },

        ui: {
            muteBtn : '.mute-video',
            muteBtnIcon : '.mute-video span'
        },

        onShow: function () {
            this.controller = {};
            this.controller.video = document.getElementById('video-player-' + this.model.get('_cid'));
            this.controller.audio = document.getElementById('audio-player-' + this.model.get('_cid'));
        },

        play: function () {
            this.controller.video.play();
            this.controller.audio.play();
        },

        mute: function () {
            this.controller.audio.muted = !this.controller.audio.muted;
            this.ui.muteBtn.toggleClass('btn-success btn-warning');
            this.ui.muteBtnIcon.toggleClass('glyphicon-volume-off glyphicon-volume-up');
        },

        _remove: function () {
            vent.trigger('player:remove', this.model);
            this.remove();
        }

    });

    return PlayerView;

});
