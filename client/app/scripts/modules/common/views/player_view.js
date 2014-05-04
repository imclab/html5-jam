/*global define*/
/*global window*/
define(function (require) {
    'use strict';

    var Marionette = require('marionette');
    var vent = require('modules/common/vent');

    var PlayerView = Marionette.ItemView.extend({

        className: 'video-player',

        events: {
            'click .delete-video' : '_remove',
            'click .play-video' : 'play',
            'click .mute-video' : 'mute'
        },

        ui: {
            muteBtn : '.mute-video',
            muteBtnIcon : '.mute-video span',
            videoContainer : '.video-container',
            audioContainer : '.audio-container'
        },

        onShow: function () {
            this.controller = {};
            this.key = "";

            if (this.ui.videoContainer.length > 0) {
                this.key = "video_" + this.model.cid;
                this.controller["video_" + this.model.cid] = document.getElementById('video-player-' + this.model.cid);
            }

            if (this.ui.audioContainer.length > 0) {
                this.key = "audio_" + this.model.cid;
                this.controller["audio_" + this.model.cid] = document.getElementById('audio-player-' + this.model.cid);
            }
        },

        play: function () {
            _.each(this.controller, function (key) {
                key.play();
            });
        },

        mute: function () {
            this.controller[this.key].muted = !this.controller[this.key].muted;
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
