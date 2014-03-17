/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var VideoModel = require('modules/common/models/video');
    var VideoCollection = require('modules/common/collections/videos');

    var VideoElement = Marionette.ItemView.extend({

        template: 'production/video_sidebar',

        className: 'videoElement'

    });

    var SideBarView = Marionette.CompositeView.extend({

        tagName: 'div',

        className: 'view-wrapper',

        itemView: VideoElement,

        itemViewContainer: '.videos-list',

        template: 'production/sidebar',

        initialize: function () {
            this.collection = new VideoCollection();
        }

    });

    return SideBarView;

});
