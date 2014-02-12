/*global define*/
/*global window*/
define(function (require) {
    'use strict';

    var Marionette = require('marionette');
    var Video = require('modules/common/models/video');
    var vent = require('modules/common/vent');
    var PlayerView = require('modules/common/views/player_view');

    var RecorderView = Marionette.CompositeView.extend({

        tagName: 'div',

        itemView: PlayerView,

        itemViewContainer: '.videos-container',

        template: 'recorder',

        initialize: function () {
            this.collection = new Video.VideoCollection();

            this.collection.on('remove', function () {
                console.log('Remove');
            }, this);
        },

        events: {
            "click .playbtn" : "play",
            "click .stopbtn" : "stop",
            "click .recbtn"  : "record"
        },

        ui: {
            onStage: '.stageLight'
        },

        play: function () {
            vent.trigger("recorder:play");
        },

        stop: function () {
            vent.trigger("recorder:stop");

            if (this.ui.onStage.hasClass('onStage')) {
                this.ui.onStage.removeClass('onStage');
            }
        },

        record: function () {
            vent.trigger("recorder:record");

            this.ui.onStage.addClass('onStage');
        }

    });

    return RecorderView;

});
