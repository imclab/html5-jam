/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');

    var ProfilView = Marionette.ItemView.extend({

        template: 'profil/profil',

        className: ''

    });

    return ProfilView;

});