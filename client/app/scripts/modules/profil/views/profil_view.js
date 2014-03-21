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
            if (this.model.attributes.doIFollowHim == false) {
                vent.trigger("user:follow", this.model.id);
                this.model.attributes.doIFollowHim = true;
                this.render();
            } else {
                vent.trigger("user:unfollow", this.model.id);
                this.model.attributes.doIFollowHim = false;
                this.render();
            }
        }

    });

    return ProfilView;

});