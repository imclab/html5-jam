/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var vent = require('modules/common/vent');

    var AppData = require('modules/common/app_data');

    var TopBar = Marionette.ItemView.extend({
        el: '#topbar',

        events: {
            'click button.logout' : 'logout'
        },

        getTemplate: function () {
            if (this.model) {
                return 'topbar/topbar';
            } else {
                return 'topbar/topbar_empty';
            }
        },

        initialize: function () {
            if (this.$el.hasClass('hidden')) {
                this.$el.removeClass('hidden');
            }

            this.model = AppData.user;
            this.render();
        },

        logout: function () {
            vent.trigger('topbar:logout');
        }

    });

    return TopBar;
});