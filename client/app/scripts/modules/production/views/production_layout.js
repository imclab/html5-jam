/*global define*/
define(function (require) {
    'use strict';

    var Marionette = require('marionette');

    var ProductionLayout = Marionette.Layout.extend({

        template: 'production',

        className: 'view-wrapper',

        regions: {
            sidebar: '.sidebar',
            recorder: '.recorder',
            comments: '.comments'
        }

    });

    return ProductionLayout;
});