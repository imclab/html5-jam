/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require("marionette");
    var Backbone = require("backbone");
    var vent = require("modules/common/vent");

    var JamView = Marionette.ItemView.extend({
        className: "jam-element",

        template: "common/jam",

        events: {
            "click h3" : "redirection",
            "click .likes" : "like",
            "click .ownerName" : "goToOwnerProfile"
        },

        redirection: function () {
            Backbone.history.navigate("jam/" + this.model.id, true);
        },

        like: function (event) {
            event.stopPropagation();
            if (this.model.doILikeIt() === false) {
                vent.trigger("jam:like", this.model.get("id"));
                this.model.set("doILikeIt", true);
                var nbLikes = this.model.get("nbLikes") + 1;
                this.model.set("nbLikes", nbLikes);
                this.render();
            } else {
                vent.trigger("jam:dislike", this.model.get("id"));
                this.model.set("doILikeIt", false);
                var nbLikes = this.model.get("nbLikes") - 1;
                this.model.set("nbLikes", nbLikes);
                this.render();
            }
        },

        serializeData: function () {
            var data = Marionette.ItemView.prototype.serializeData.call(this);

            return data;
        },

        goToOwnerProfile: function (event) {
            event.stopPropagation();
        }
    });

    return JamView;
});
