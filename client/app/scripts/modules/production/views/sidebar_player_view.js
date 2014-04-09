/*global define*/
/*global window*/
define(function (require) {
    'use strict';

    var Marionette = require('marionette');
    var vent = require('modules/common/vent');
    var PlayerView = require('modules/common/views/player_view');

    var SidePlayerView = PlayerView.extend({

        template: 'production/video_sidebar',

        ui: {
            muteBtn : '.mute-video',
            muteBtnIcon : '.mute-video span'
        },

        play: function () {
            this.controller.video.src = this.model.get("path");

            PlayerView.prototype.play.call(this);
        },

        mute: function () {
            this.controller.audio.muted = !this.controller.audio.muted;
            this.ui.muteBtn.toggleClass('btn-success btn-warning');
            this.ui.muteBtnIcon.toggleClass('glyphicon-volume-off glyphicon-volume-up');
        }
    });

    return SidePlayerView;

});
