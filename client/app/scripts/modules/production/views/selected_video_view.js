/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var VideoPlayer = require('modules/common/views/player_view');
    var Video = require('modules/common/models/video');

    var SelectedVideoCollection = Marionette.CollectionView.extend({

        itemView: VideoPlayer,

        initialize: function () {

            this.collection = new Video.VideoCollection();

        }

    });

    return SelectedVideoCollection;
});
