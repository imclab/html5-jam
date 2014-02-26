/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var vent = require('modules/common/vent');

    var ProfilView = Marionette.ItemView.extend({

        getTemplate: function () {
            if (this.model) {
                return 'profil/profil';
            } else {
                return 'profil/profil_empty';
            }
        },

        initialize: function () {
            this.listenToOnce(vent, 'appdata:user:fetched', this.actualize);
        },

        actualize: function () {
            this.render();
        }

    });

    return ProfilView;

});