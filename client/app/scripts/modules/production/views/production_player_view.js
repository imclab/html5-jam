/*global define*/
/*global window*/
/*global document*/
define(function (require) {
    'use strict';

    var vent = require('modules/common/vent');
    var PlayerView = require('modules/common/views/player_view');

    var MixPlayer = PlayerView.extend({

        template: 'production/mix_player',

        onShow: function () {
            PlayerView.prototype.onShow.call(this);

            vent.trigger("videoplayer:add", this.controller, this.model.cid);
        },

        onClose: function () {
            PlayerView.prototype.onClose.call(this);

            vent.trigger("videoplayer:remove", this.model.cid);
        }

    });

    var VideoPlayer = PlayerView.extend({

        template: 'production/video_player',

        onShow: function () {
            PlayerView.prototype.onShow.call(this);

            vent.trigger("videoplayer:add", this.controller, this.model.cid);
        },

        onClose: function () {
            PlayerView.prototype.onClose.call(this);

            vent.trigger("videoplayer:remove", this.model.cid);
        }

    });

    var SidePlayer = PlayerView.extend({

        template: 'production/video_player'

    });

    return {
        VideoPlayer: VideoPlayer,
        MixPlayer: MixPlayer,
        SidePlayer: SidePlayer
    };
});
