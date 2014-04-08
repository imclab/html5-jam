/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var vent = require('modules/common/vent');

    var AppData = require('modules/common/app_data');

    var ProfilView = Marionette.ItemView.extend({

        getTemplate: function () {
            if (this.model) {
                return 'profil/profil';
            } else {
                return 'profil/profil_empty';
            }
        },

        events: {
            "click .followButton" : "follow"
        },

        follow: function () {
            if (this.model.get("doIFollowHim") === false) {
                vent.trigger("user:follow", this.model.get("id"));
                this.model.set("doIFollowHim", true);
                this.render();
            } else {
                vent.trigger("user:unfollow", this.model.get("id"));
                this.model.set("doIFollowHim", false);
                this.render();
            }
        },

        serializeData: function () {
            var data = Marionette.ItemView.prototype.serializeData.call(this);
            var followData = this.followData();

            return _.extend(data, {
                isOwner: AppData.isOwner(data.id),
                followData: followData
            });
        },

        followData: function () {
            if (this.model) {
                var doIFollowHim = this.model.get("doIFollowHim");

                return {
                    "class": doIFollowHim ? "btn-success" : "btn-info",
                    label: doIFollowHim ? "Unfollow" : "Follow"
                };
            }

            return;
        }

    });

    return ProfilView;

});