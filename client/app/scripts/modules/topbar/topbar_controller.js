/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');
    var Marionette = require('marionette');
    var vent = require('modules/common/vent');
    var TopBar = require('modules/topbar/views/topbar_view');
    var User = require('modules/common/models/user');

    var AppData = require('modules/common/app_data');

    var TopbarController = Marionette.Controller.extend({
        initialize: function (options) {
            this._initializeAttributes();
            this._bindEvents();
        },

        _initializeAttributes: function () {
            this.attributes = {};
            this.attributes.models = {};
        },

        _bindEvents: function () {
            // this.listenTo(vent, 'topbar:feeds', this.toHome);
            // this.listenTo(vent, 'topbar:username', this.toProfil);
            // this.listenTo(vent, 'topbar:friends', this.toFriendList);
            this.listenTo(vent, 'topbar:newJam', this.toNewProject);
        },

        show: function () {
            this.getView().render();
        },

        getView: function () {
            return new TopBar({ model : AppData.user });
        },

        toFriendList: function () {
            this.navigate('friends/');
        },

        toProfil: function () {
            this.navigate('profil/' + AppData.user.get('id'));
        },

        toNewProject: function () {
            this.navigate('jam/');
        },

        toHome: function () {
            this.navigate('/');
        },

        navigate: function (destination) {
            Backbone.history.navigate(destination, true);
        }

    });

    return TopbarController;
});
