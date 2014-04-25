/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');
    var Marionette = require('marionette');
    var AppData = require('modules/common/app_data');

    var JamView = require('modules/common/views/jam_view');
    var JamModel = require('modules/common/models/jam');

    var ProfilJamView = JamView.extend({
        template: 'profil/profil_jam',

        initialize: function () {
            JamView.prototype.initialize.call(this);

            _.extend(this.events, {
                "click button.deleteJam": "deleteJam"
            });
        },

        deleteJam: function () {
            this.model.destroy({
                success: function () {
                    console.log("Jam destroy Arguments : ", arguments);
                }
            });
        },

        serializeData: function () {
            var data = Marionette.ItemView.prototype.serializeData.call(this);

            _.extend(data, {
                isOwner: AppData.isOwner(data.userId)
            });

            return data;
        }
    });

    return ProfilJamView;
});
