/*global define*/
/*global window*/
define(function (require) {
    'use strict';

    var PlayerView = require('modules/common/views/player_view');

    var SidePlayerView = PlayerView.extend({

        template: 'production/video_sidebar'

    });

    return SidePlayerView;

});
