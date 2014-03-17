/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var vent = require('modules/common/vent');

    var AppData = require('modules/common/app_data');

    var Jam = require('modules/common/models/jam');

    var TopBar = Marionette.ItemView.extend({
        
        el: '#topbar',

        events: {
            'click .newJam' : 'toNewProject',
            'click .profilBtn' : 'toProfil',
            'click .username' : 'toHome'
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

            this.listenTo(vent, 'user:fetching:end', function () {
                this.model = AppData.user;
                this.render();
            });
        },

        toFriendList: function () {
            vent.trigger('topbar:friends');
        },

        toProfil: function () {
            vent.trigger('topbar:profil');
        },

        toNewProject: function () {
            vent.trigger('topbar:newJam');
        },

        toHome: function () {
            vent.trigger('topbar:home');
        }

    });

    return TopBar;
});