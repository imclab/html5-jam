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
            comments: '.comments'
        },

        initialize: function (options) {
            this.mode = options.mode || "";
        },

        serializeData: function () {
            var data = Marionette.Layout.prototype.serializeData.call(this);

            return _.extend(data, {
                mode: this.mode
            });
        }

    });

    return ProductionLayout;
});