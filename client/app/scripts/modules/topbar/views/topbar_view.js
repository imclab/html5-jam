/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var vent = require('modules/common/vent');

    var TopBar = Marionette.ItemView.extend({

        template: 'topbar/topbar',

        el: '#topbar',

        events: {
            'click .newProjectBtn' : 'toNewProject',
            'click .friendlistBtn' : 'toFriendList',
            'click .profilBtn' : 'toProfil'
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