/*global define*/
define(function (require) {
    'use strict';

    var Marionette = require('marionette');

    var FriendListLayout = Marionette.Layout.extend({

        template: 'friendlist/friendlist_layout',

        className: 'view-wrapper',

        regions: {
            sidebar: '.friendlist_sidebar',
            stamplist: '.stamplist'
        }

    });

    return FriendListLayout;
});