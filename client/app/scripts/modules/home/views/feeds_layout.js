/*global define*/
define(function (require) {
    'use strict';

    var Marionette = require('marionette');
    var vent = require('modules/common/vent');

    var ProfilLayout = Marionette.Layout.extend({

        template: 'home/feeds_layout',

        regions: {
            feeds: '.feeds',
            menu: '.menu'
        },

        events: {
            "click .mostPopular" : "showMostPopular",
            "click .mostRecent" : "showMostRecent",
            "click .friendsJams" : "showFriendsJams",
            "click .ourFavorites" : "showOurFavorites"
        },

        showMostPopular: function (e) {
            vent.trigger('feeds:showSelection', 'popular');
            this.selectFeedsButton(e.target);
        },

        showMostRecent: function (e) {
            vent.trigger('feeds:showSelection', 'recent');
            this.selectFeedsButton(e.target);
        },

        showFriendsJams: function (e) {
            vent.trigger('feeds:showSelection', 'friendsJams');
            this.selectFeedsButton(e.target);
        },

        showOurFavorites: function (e) {
            vent.trigger('feeds:showSelection', 'ourfavorites');
            this.selectFeedsButton(e.target);
        },

        selectFeedsButton: function (button) {
            $('button', '.btn-group').removeClass('active');
            $(button).addClass('active');
        }

    });

    return ProfilLayout;
});
