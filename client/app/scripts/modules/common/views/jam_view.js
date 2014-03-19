/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require("marionette");
    var Backbone = require("backbone");
    var vent = require("modules/common/vent");

    var JamCollection = require("modules/common/collections/jams");

    var JamView = Marionette.ItemView.extend({
        className: "jam-element",

        template: "common/jam",

        events: {
            "click .jam" : "redirection",
            "click .likes" : "like",
            "click .ownerName" : "goToOwnerProfile"
        },

        redirection: function () {
            Backbone.history.navigate("jam/" + this.model.id, true);
        },

        like: function (event) {
            event.stopPropagation();
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
        },

        goToOwnerProfile: function (event) {
            event.stopPropagation();
        }
    });

    return JamView;
});
