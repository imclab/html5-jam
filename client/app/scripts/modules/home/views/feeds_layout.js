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
            vent.trigger('feeds:showMostPopular', 'popular');
            this.selectFeedsButton(e.target);
        },

        showMostRecent: function (e) {
            vent.trigger('feeds:showMostRecent', 'recent');
            this.selectFeedsButton(e.target);
        },

        showFriendsJams: function (e) {
            vent.trigger('feeds:showFriendsJams', 'friends');
            this.selectFeedsButton(e.target);
        },

        showOurFavorites: function (e) {
            vent.trigger('feeds:showOurFavorites', 'ourfavorites');
            this.selectFeedsButton(e.target);
        },

        selectFeedsButton: function (button) {
            $('button', '.btn-group').removeClass('active');
            $(button).addClass('active');
        }

    });

    return ProfilLayout;
});
