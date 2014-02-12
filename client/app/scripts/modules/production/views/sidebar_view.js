/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var Video = require('modules/common/models/video');

    var VideoElement = Marionette.ItemView.extend({

        template: 'video_element',

        className: 'videoElement'

    });

    var SideBarView = Marionette.CompositeView.extend({

        tagName: 'div',

        className: 'view-wrapper',

        itemView: VideoElement,

        itemViewContainer: '.videos-list',

        template: 'sidebar',

        initialize: function () {

            this.collection = new Video.VideoCollection();

            this.collection.add(new Video.VideoInfoModel({
                username: "Pouch",
                comment: "Voix aigue, hihi"
            }));

            this.collection.add(new Video.VideoInfoModel({
                username: "BogossDu60",
                comment: "Ouai"
            }));

        }

    });

    return SideBarView;

});
