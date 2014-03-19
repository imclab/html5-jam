/*global define*/
/*global window*/
define(function (require) {
    "use strict";

    var Marionette = require("marionette");
    var VideoCollection = require("modules/common/collections/videos");
    var vent = require("modules/common/vent");
    var PlayerView = require("modules/common/views/player_view");
    var Jam = require('modules/common/models/jam');

    var RecorderView = Marionette.CompositeView.extend({

        tagName: "div",

        itemView: PlayerView,

        itemViewContainer: ".videos-container",

        template: "production/recorder",

        initialize: function () {
            this.model = new Jam();
            this.collection = new VideoCollection();

            this.collection.on("remove", function () {
                console.log("Remove");
            }, this);
        },

        events: {
            "click .playbtn" : "play",
            "click .stopbtn" : "stop",
            "click .recbtn"  : "record",
            "click .savebtn" : "save",
            "click .createbtn" : "create",
            "click .likeButton" : "like"
        },

        ui: {
            onStage: ".stageLight"
        },

        create: function () {
            vent.trigger("jam:create");
        },

        play: function () {
            vent.trigger("recorder:play");
        },

        stop: function () {
            vent.trigger("recorder:stop");

            if (this.ui.onStage.hasClass("onStage")) {
                this.ui.onStage.removeClass("onStage");
            }
        },

        record: function () {
            vent.trigger("recorder:record");

            this.ui.onStage.addClass("onStage");
        },

        save: function () {
            vent.trigger("recorder:save");
        },

        like: function () {
            if (this.model.attributes.doILikeIt == false) {
                vent.trigger("jam:like", this.model.id);
                this.model.attributes.doILikeIt = true;
                this.model.attributes.nbLikes++;
                this.render();
            } else {
                vent.trigger("jam:dislike", this.model.id);
                this.model.attributes.doILikeIt = false;
                this.model.attributes.nbLikes--;
                this.render();
            }
        }

    });

    return RecorderView;

});
