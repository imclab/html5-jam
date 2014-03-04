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

        initialize: function () {
            this.listenTo(vent, 'user:fetching:end', function () {
                this.model = AppData.user;
                this.render();
            });
        }
    });

    return ProfilView;

});