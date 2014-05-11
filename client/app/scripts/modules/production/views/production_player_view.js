/*global define*/
/*global window*/
/*global document*/
define(function (require) {
    'use strict';

    var vent = require('modules/common/vent');
    var Marionette = require('marionette');

    var VideoPlayer = Marionette.ItemView.extend({

        template: 'production/recorder_player',

        className: 'video-player',

        events: {
            'click .delete-video' : '_remove',
            'click .play-video' : 'play',
            'click .mute-video' : 'mute',
            'click .active-video' : 'active'
        },

        ui: {
            muteBtn : '.mute-video',
            muteBtnIcon : '.mute-video span',
            videoContainer : '.video-container',
            audioContainer : '.audio-container'
        },

        onShow: function () {
            vent.trigger("videoplayer:add", this.model.has('path'), this.model.cid);
        },

        play: function () {
            vent.trigger("videoplayer:play", this.model.has('path'), this.model.cid);
        },

        active: function () {
            this.model.set("active", 0);
            this.model.save();
            vent.trigger('player:unactive', this.model);
        },

        mute: function () {
            vent.trigger("videoplayer:mute", this.model.has('path'), this.model.cid);

            this.ui.muteBtn.toggleClass('btn-success btn-warning');
            this.ui.muteBtnIcon.toggleClass('glyphicon-volume-off glyphicon-volume-up');
        },

        serializeData: function () {
            var data = Marionette.ItemView.prototype.serializeData.call(this);

            return _.extend(data, {
                _cid: this.model.cid,
                path: data.path || ""
            });
        },

        _remove: function () {
            vent.trigger('player:remove', this.model);
            this.remove();
        }

    });

    return VideoPlayer;
});
