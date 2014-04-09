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
            onStage: ".onStage",
            edit_jam_name: "input.edit-jam-name",
            recordBtn: '.recbtn',
            likeButton: 'button.likeButton',
            nbLikes: 'span.nbLikes'
        },

        create: function () {
            vent.trigger("jam:create");
        },

        play: function () {
            vent.trigger("recorder:play");
        },

        stop: function () {
            vent.trigger("recorder:stop");

            this.ui.onStage.addClass("hide");
            this.ui.recordBtn.addClass('btn-danger').removeClass('btn-warning');
        },

        record: function () {
            vent.trigger("recorder:record");

            this.ui.onStage.removeClass("hide");
        },

        save: function () {
            vent.trigger("recorder:save");
        },

        serializeData: function () {
            var data = Marionette.CompositeView.prototype.serializeData.call(this);
            var likeOptions = this._getLikeOptions();

            return _.extend(data, {
                options: likeOptions
            });
        },

        _getLikeOptions: function () {
            if (this.model) {
                var doILikeIt = this.model.get("doILikeIt");

                return {
                    "class": doILikeIt ? "btn-success" : "btn-info",
                    oldClass: !doILikeIt ? "btn-success" : "btn-info",
                    label: doILikeIt ? "Unlike" : "I like it !"
                };
            }
        },

        like: function () {
            if (!this.model.get("doILikeIt")) {
                vent.trigger("jam:like", this.model.get("id"));
                this.model.set("doILikeIt", true);
                this.model.attributes.nbLikes++;
                this._renderLike();
            } else {
                vent.trigger("jam:dislike", this.model.get("id"));
                this.model.set("doILikeIt", false);
                this.model.attributes.nbLikes--;
                this._renderLike();
            }
        },

        _renderLike: function () {
            var options = this._getLikeOptions();
            this.ui.likeButton.removeClass(options.oldClass);
            this.ui.likeButton.addClass(options["class"]);
            this.ui.likeButton.html("<span class=\"glyphicon glyphicon-music\"></span>&nbsp;&nbsp;" + options.label);
            this.ui.nbLikes.text(this.model.get("nbLikes"));
        }

    });

    return RecorderView;

});
