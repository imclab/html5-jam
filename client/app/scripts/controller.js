/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var Backbone = require('backbone');
    var vent = require('modules/common/vent');

    var LoadingView = require("modules/common/views/loading_view");
    var AuthManager = require('modules/common/auth_manager');
    var AppData = require('modules/common/app_data');

    var MainController = Marionette.Controller.extend({

        controllerNames: ["login", "home", "production", "login", "topbar", "friendlist", "profil"],

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
            this._createController("login").then(_.bind(this._showController, this, "login"));
        },

        showIndex: function () {
            if (this.handleConnection()) {
                this.handleTopbar();
                this._createController("home").then(_.bind(this._showController, this, "home"));
            }
        },

        editJam: function (jamId) {
            if (this.handleConnection()) {
                var options = {
                    mode: 'edit',
                    jamId: jamId
                };
                this.handleTopbar();
                this._createController("production", options).then(_.bind(this._showController, this, "production", options));
            }
        },

        showJam: function (jamId) {
            if (this.handleConnection()) {
                var options = {
                    mode: 'show',
                    jamId: jamId
                };
                this.handleTopbar();
                this._createController("production", options).then(_.bind(this._showController, this, "production", options));
            }
        },

        createJam: function () {
            if (this.handleConnection()) {
                var options = {
                    mode: 'create'
                };
                this.handleTopbar();
                this._createController("production", options).then(_.bind(this._showController, this, "production", options));
            }
        },

        showProfil: function (profilId) {
            if (this.handleConnection()) {
                var options = {
                    profilId: profilId
                };
                this.handleTopbar();
                this._createController("profil", options).then(_.bind(this._showController, this, "profil", options));
            }
        },

        showFriends: function () {
            if (this.handleConnection()) {
                this.handleTopbar();
                this._createController("friendlist").then(_.bind(this._showController, this, "friendlist"));
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
                this._createController("topbar").then(_.bind(this._showController, this, "topbar"));
            }
        },

        showLoading: function () {
            this.regions.corpus.show(new LoadingView());
        },

        _createController: function (page, options) {
            var deferred = new $.Deferred();

            if (!this.controllers[page]) {
                this.showLoading();

                require([this.path(page)], _.bind(function (Controller) {
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

        _showController: function(page, options) {
            this._closeControllersExcept(page);

            this.controllers[page].show(options);
        },

        _closeControllersExcept: function (controllerName) {
            var toClose = _.without(this.controllerNames, controllerName);

            this._closeControllers(toClose);
        },

        _closeControllers: function (controllerNames) {
            var self = this;

            if (!_.isArray(controllerNames)) {
                controllerNames = [controllerNames];
            }

            if (this.controllers) {
                _.each(controllerNames, function (controllerName) {
                    if (self.controllers["controllerName"]) {
                        self.controllers["controllerName"].close();
                        delete self.controllers["controllerName"];
                    }
                });
            }
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

        path: function (page) {
            return "modules/"+page+"/"+page+"_controller";
        }

    });

    return MainController;
});
