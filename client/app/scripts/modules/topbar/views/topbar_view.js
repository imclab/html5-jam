/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var vent = require('modules/common/vent');

    var TopBar = Marionette.ItemView.extend({
        
        el: '#topbar',

        events: {
            'click .newProjectBtn' : 'toNewProject',
            'click .friendlistBtn' : 'toFriendList',
            'click .profilBtn' : 'toProfil'
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

            this.listenToOnce(vent, 'appdata:user:fetched', this.actualize);
        },

        actualize: function () {
            this.render();
            // console.log("Render again : ", this.model);
        },

        toFriendList: function () {
            vent.trigger('topbar:friends');
        },

        toProfil: function () {
            vent.trigger('topbar:profil');
        },

        toNewProject: function () {
            vent.trigger('topbar:newproject');
        }

    });

    return TopBar;

});