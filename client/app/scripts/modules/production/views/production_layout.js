/*global define*/
define(function (require) {
    'use strict';

    var Marionette = require('marionette');

    var ProductionLayout = Marionette.Layout.extend({

        template: 'production/production',

        className: 'view-wrapper',

        regions: {
            sidebar: '.sidebar',
            recorder: '.recorder',
            comments: '.comments',
            videos_list: '.videos_list'
        }

    });

    return ProductionLayout;
});