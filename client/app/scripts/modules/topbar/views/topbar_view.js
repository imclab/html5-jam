/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var vent = require('modules/common/vent');

    var AppData = require('modules/common/app_data');

    var TopBar = Marionette.ItemView.extend({

        template: 'topbar/topbar',

        model: AppData.user,

        el: '#topbar',

        events: {
            'click .newProjectBtn' : 'toNewProject',
            'click .friendlistBtn' : 'toFriendList',
            'click .profilBtn' : 'toProfil'
        },

        initialize: function () {
            if (this.$el.hasClass('hidden')) {
                this.$el.removeClass('hidden');
            }

this.model = AppData.user;


            this.listenTo(this.model, 'change:username', this.render);
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