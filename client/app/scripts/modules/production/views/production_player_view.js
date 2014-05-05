/*global define*/
/*global window*/
/*global document*/
define(function (require) {
    'use strict';

    var vent = require('modules/common/vent');
    var PlayerView = require('modules/common/views/player_view');

    var VideoPlayer = PlayerView.extend({

        template: 'production/recorder_player',

        onShow: function () {
            PlayerView.prototype.onShow.call(this);

            vent.trigger("videoplayer:add", this.controller);
        }

    });

    var SidePlayer = PlayerView.extend({

        template: 'production/video_player'

    });

    return {
        VideoPlayer: VideoPlayer,
        MixPlayer: VideoPlayer,
        SidePlayer: SidePlayer
    };
});
