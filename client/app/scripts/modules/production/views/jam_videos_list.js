/*global define*/
/*global window*/
define(function (require) {
    'use strict';

    var Marionette = require('marionette');
    var VideoCollection = require('modules/common/collections/videos');
    var PlayerView = require('modules/common/views/player_view');

    var RecorderView = Marionette.CollectionView.extend({

        tagName: 'div',

        itemView: PlayerView,

        itemViewContainer: '.videos-container',

        template: 'production/videos_list',

        initialize: function () {
            this.collection = new VideoCollection();
        }
    });

    return RecorderView;

});
