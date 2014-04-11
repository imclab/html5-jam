/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');
    var Marionette = require('marionette');
    var vent = require('modules/common/vent');
    var TopBar = require('modules/topbar/views/topbar_view');
    var User = require('modules/common/models/user');

    var AuthManager = require('modules/common/auth_manager');

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
            this.listenTo(vent, 'topbar:feeds', this.toHome);
            this.listenTo(vent, 'topbar:username', this.toProfil);
            this.listenTo(vent, 'topbar:newJam', this.toNewProject);
            this.listenTo(vent, 'topbar:logout', this.logout);
        },

        show: function () {
            this.getView().render();
        },

        getView: function () {
            return new TopBar({ model : AppData.user });
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

        logout: function () {
            new AuthManager().removeAuthenticationCookie();
            this.navigate('login/');
            window.location.reload();
        },

        navigate: function (destination) {
            Backbone.history.navigate(destination, true);
        }

    });

    return TopbarController;
});
