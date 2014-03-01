/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var VideoPlayer = require('modules/common/views/player_view');
    var VideoCollection = require('modules/common/collections/videos');

    var SelectedVideoCollection = Marionette.CollectionView.extend({

        itemView: VideoPlayer,

        initialize: function () {

            this.collection = new VideoCollection();

        }

    });

    return SelectedVideoCollection;
});
