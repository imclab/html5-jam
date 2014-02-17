/*global define*/
define(function (require) {
    'use strict';

    var Marionette = require('marionette');

    var ProfilLayout = Marionette.Layout.extend({

        template: 'profil/profil_layout',

        className: 'profil_layout',

        regions: {
            content: '.content',
            jamlist: '.jamlist'
        }

    });

    return ProfilLayout;
});