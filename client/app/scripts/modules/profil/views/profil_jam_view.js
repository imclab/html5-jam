/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var Backbone = require('backbone');
    var vent = require('modules/common/vent');

    var JamView = require('modules/common/views/jam_view');

    var ProfilJamView = JamView.extend({
        template: 'profil/profil_jam',

        events: {
            "click button.deleteJam" : "deleteJam"
        },

        deleteJam: function () {
            this.model.destroy({
                success: function () {
                    console.log("Jam destroy Arguments : ", arguments);
                }
            });
        },

        serializeData: function () {
            return {
                description: this.model.get("description"),
                name: this.model.get("name"),
                createdAt: this.model.get("createdAt"),
                isOwner: true
            };
        }
    });

    return ProfilJamView;
});
