/*global define*/
/*global window*/
define(function (require) {
    'use strict';

    var Marionette = require('marionette');
    var VideoCollection = require('modules/common/collections/videos');
    var vent = require('modules/common/vent');
    var PlayerView = require('modules/common/views/player_view');

    var RecorderView = Marionette.CompositeView.extend({

        tagName: 'div',

        itemView: PlayerView,

        itemViewContainer: '.videos-container',

        template: 'production/recorder',

        initialize: function () {
            this.collection = new VideoCollection();

            this.collection.on('remove', function () {
                console.log('Remove');
            }, this);
        },

        events: {
            "click .playbtn" : "play",
            "click .stopbtn" : "stop",
            "click .recbtn"  : "record",
            "click .savebtn" : "save",
            "click .createbtn" : "create"
        },

        ui: {
            onStage: '.stageLight'
        },

        create: function () {
            vent.trigger("jam:create");
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
        },

        save: function () {
            vent.trigger("recorder:save");
        }

    });

    return RecorderView;

});
