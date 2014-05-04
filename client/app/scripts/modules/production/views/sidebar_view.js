/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var VideoModel = require('modules/common/models/video');
    var VideoCollection = require('modules/common/collections/videos');
    var PlayerView = require("modules/production/views/production_player_view");

    var SideBarView = Marionette.CompositeView.extend({

        tagName: 'div',

        className: 'view-wrapper',

        itemView: PlayerView.SidePlayer,

        itemViewContainer: '.videos-list',

        template: 'production/sidebar',

        initialize: function () {
            this.collection = new VideoCollection();
        }

    });

    return SideBarView;

});
