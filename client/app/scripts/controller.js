/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var Backbone = require('backbone');
    var vent = require('modules/common/vent');

    var Controllers = {};

    Controllers.production = require('modules/production/production_controller');
    Controllers.topbar = require('modules/topbar/topbar_controller');
    Controllers.friendlist = require('modules/friendlist/friendlist_controller');
    Controllers.profil = require('modules/profil/profil_controller');
    Controllers.login = require('modules/login/login_controller');
    Controllers.home = require('modules/home/home_controller');

    var AuthManager = require('modules/common/auth_manager');

    // var Cook = require('modules/common/cookie_manager');

    var AppData = require('modules/common/app_data');

    var MainController = Marionette.Controller.extend({

        initialize: function (options) {
            this.regions = options.regions || {};
            this._initializeAttributes();
            this._bindEvents();
            this._initializeAuthentication();
        },

        handleConnection: function () {
            if (!AppData.user) {
                if (this.attributes.authmanager.checkAuthenticationCookie()) {
                    this.attributes.authmanager.authenticationRequest();
                } else {
                    // Pas de cookie found
                    Backbone.history.navigate('login/', true);
                }
            }
        },

        handleToken: function (tokenId) {
            this.attributes.authmanager.setAuthenticationCookie(tokenId.replace('?token=', ''));

            this.listenToOnce(vent, 'user:fetching:end', function () {
                // AppData.user is created and fetched
                Backbone.history.navigate('/', true);
            });

            this.attributes.authmanager.authenticationRequest(function (response) {
                console.log("[Controller > handleToken] Auth SUCCESS", response);
                vent.trigger('authentication:success', response.id);
            }, function (xhr) {
                console.log("[Controller > handleToken] Auth FAILED", xhr);
            });
        },

        showLogin: function () {
            this._createController("login");
        },

        showIndex: function () {
            this.handleConnection();
            this._createController("topbar");
            this._createController("home");
        },

        editJam: function (jamId) {
            this.handleConnection();
            this._createController("topbar");
            this._createController("production", {
                mode: 'edit',
                jamId: jamId
            });
        },

        showJam: function (jamId) {
            this.handleConnection();
            this._createController("topbar");
            this._createController("production", {
                mode: 'show',
                jamId: jamId
            });
        },

        createJam: function () {
            this.handleConnection();
            this._createController("topbar");
            this._createController("production", {
                mode: 'create'
            });
        },

        showProfil: function (profilId) {
            this.handleConnection();
            this._createController("topbar");
            this._createController("profil", {
                profilId: profilId
            });
        },

        showFriends: function () {
            this.handleConnection();
            this._createController("topbar");
            this._createController("friendlist");
        },

        showAboutDialog: function () {
            console.log("SHOWABOUTDIALOG");
        },

        showLegalDialog: function () {
            console.log("SHOWLEGALDIALOG");
        },

        _createController: function (str, options) {
            if (!this.controllers[str]) {
                options = options || {};

                options.region = this.regions ? this.regions.corpus : null;
                options.user = AppData ? AppData.user : null;

                this.controllers[str] = new this.Controllers[str](options);
                this.controllers[str].show(options);
            } else {
                this.controllers[str].show(options);
            }
        },

        _initializeAttributes: function () {
            this.controllers = {};
            this.attributes = {};
            this.attributes.models = {};
            this.attributes.authmanager = new AuthManager();

            this.Controllers = Controllers;
        },

        _initializeAuthentication: function () {
            this.listenToOnce(vent, 'authentication:success', function (_id) {
                AppData.initUser(_id);
                AppData.fetchUser();
            });

            this.listenTo(vent, 'authentication:fail', function () {
                Backbone.history.navigate('login/', true);
            });
        },

        _bindEvents: function () {
            this.listenTo(vent, 'actualize:appdata', function () {
                console.log('[Controller > actualize:appdata]');
                AppData.fetchUser();
            });
        },

    });

    return MainController;
});
