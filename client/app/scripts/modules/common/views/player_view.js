/*global define*/
define(function (require) {
    "use strict";

    var vent = require('modules/common/vent');
    var Marionette = require('marionette');
    var VideoModel = require('modules/common/models/video');
    var VideoCollection = require('modules/common/collections/videos');

    var PlayerView = Marionette.ItemView.extend({
        template: 'common/player',

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
            videoContainer : '.video-container'
        },

        _remove: function () {
            this.model.destroy();
            this.remove();
        },

        serializeData: function () {
            var data = Marionette.ItemView.prototype.serializeData.call(this);

            return _.extend(data, {
                _cid: this.model.cid,
                path: data.path || ""
            });
        }
    });
