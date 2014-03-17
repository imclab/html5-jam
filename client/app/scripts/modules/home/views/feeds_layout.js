/*global define*/
define(function (require) {
    'use strict';

    var Marionette = require('marionette');

    var ProfilLayout = Marionette.Layout.extend({

        template: 'home/feeds_layout',

        regions: {
            feeds: '.feeds',
            menu: '.menu'
        }

    });

    return ProfilLayout;
});
