/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var Backbone = require('backbone');
    var vent = require('modules/common/vent');

    var LoadingView = require("modules/common/views/loading_view");

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
                this.showLoading();

                if (this.attributes.authmanager.checkAuthenticationCookie()) {
                    this.attributes.authmanager.authenticationRequest();
                } else {
                    // No cookie found
                    Backbone.history.navigate('login/', true);
                    return false;
                }
            }

            return true;
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
            this._createController("login").then(_.bind(this._show, this, "login"));
        },

        showIndex: function () {
            if (this.handleConnection()) {
                this.handleTopbar();
                this._createController("home").then(_.bind(this._show, this, "home"));
            }
        },

        editJam: function (jamId) {
            if (this.handleConnection()) {
                var options = {
                    mode: 'edit',
                    jamId: jamId
                };
                this.handleTopbar();
                this._createController("production", options).then(_.bind(this._show, this, "production", options));
            }
        },

        showJam: function (jamId) {
            if (this.handleConnection()) {
                var options = {
                    mode: 'show',
                    jamId: jamId
                };
                this.handleTopbar();
                this._createController("production", options).then(_.bind(this._show, this, "production", options));
            }
        },

        createJam: function () {
            if (this.handleConnection()) {
                var options = {
                    mode: 'create'
                };
                this.handleTopbar();
                this._createController("production", options).then(_.bind(this._show, this, "production", options));
            }
        },

        showProfil: function (profilId) {
            if (this.handleConnection()) {
                var options = {
                    profilId: profilId
                };
                this.handleTopbar();
                this._createController("profil", options).then(_.bind(this._show, this, "profil", options));
            }
        },

        showFriends: function () {
            if (this.handleConnection()) {
                this.handleTopbar();
                this._createController("friendlist").then(_.bind(this._show, this, "friendlist"));
            }
        },

        showAboutDialog: function () {
            console.log("SHOWABOUTDIALOG");
        },

        showLegalDialog: function () {
            console.log("SHOWLEGALDIALOG");
        },

        handleTopbar: function () {
            if (!this.controllers.topbar) {
                this._createController("topbar").then(_.bind(this._show, this, "topbar"));
            }
        },

        showLoading: function () {
            this.regions.corpus.show(new LoadingView());
        },

        _createController: function (page, options) {
            var deferred = new $.Deferred();

            if (!this.controllers[page]) {
                this.showLoading();

                require(["modules/"+page+"/"+page+"_controller"], _.bind(function (Controller) {
                    options = options || {};

                    options.region = this.regions ? this.regions.corpus : null;
                    options.user = AppData ? AppData.user : null;

                    this.controllers[page] = new Controller(options);

                    deferred.resolve();
                }, this));
            } else {
                return deferred.resolve();
            }

            return deferred;
        },

        _show: function(page, options) {
            this.controllers[page].show(options);
        },

        _initializeAttributes: function () {
            this.controllers = {};
            this.attributes = {};
            this.attributes.models = {};
            this.attributes.authmanager = new AuthManager();
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
