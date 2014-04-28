/*global define*/
/*global window*/
define(function (require) {
    'use strict';

    var vent = require('modules/common/vent');
    var PlayerView = require('modules/common/views/player_view');

    var RecorderPlayerView = PlayerView.extend({

        onShow: function () {
            PlayerView.prototype.onShow.call(this);

            vent.trigger("videoplayer:add", this.controller, this.model.cid);
        },

        onClose: function () {
            vent.trigger("videoplayer:remove", this.model.cid);
        }

    });

    return RecorderPlayerView;
});
