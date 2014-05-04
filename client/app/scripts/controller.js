/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var Backbone = require('backbone');
    var Const = require('modules/common/constants');

    var LoadingView = require('modules/common/views/loading_view');
    var AuthManager = require('modules/common/auth_manager');
    var PlayerManager = require('modules/production/player_manager');
    var AppData = require('modules/common/app_data');
    var CookieManager = require('modules/common/cookie_manager');

    var MainController = Marionette.Controller.extend({

        controllerNames: ["login", "home", "production", "login", "friendlist", "profil"],

        initialize: function (options) {
            AppData.createFakeUser();
            this.regions = options.regions || {};
            this._initializeAttributes();
            this._bindEvents();
        },

        handleConnection: function (callback) {
            if (!AppData.user) {
                this.showLoading();
                this.connect(callback);
            } else {
                callback();
            }

            return;
        },

        connect: function (callback) {
            var errorConnection = function () {
                CookieManager.remove(Const.COOKIE_AUTH);
                Backbone.history.navigate('login/', true);
            };
            var errorFetchingUser = function () {
                console.log("Error in database, user not found");
                errorConnection();
            };

            if (this.attributes.authmanager.checkAuthenticationCookie()) {
                this.attributes.authmanager.authenticationRequest()
                    .then(function (response) {
                        return AppData.fetchUser({userId: response.id});
                    }, errorConnection)
                    .then(callback, errorFetchingUser);
            } else {
                // No cookie found
                errorConnection();
            }
        },

        handleToken: function (tokenId) {
            this.attributes.authmanager.setAuthenticationCookie(tokenId.replace('?token=', ''));

            this.attributes.authmanager.authenticationRequest().then(function (response) {
                console.log("[Controller > handleToken] Auth SUCCESS", response);
                Backbone.history.navigate('/', true);
            }, function (xhr) {
                console.log("[Controller > handleToken] Auth FAILED", xhr);
            });
        },

        showLogin: function () {
            this._createController("login").then(_.bind(this._showController, this, "login"));
        },

        showIndex: function () {
            this.handleConnection(_.bind(function () {
                this.handleTopbar();
                this._createController("home").then(_.bind(this._showController, this, "home"));
            }, this));
        },

        editJam: function (jamId) {
            this.handleConnection(_.bind(function () {
                var options = {
                    mode: 'edit',
                    jamId: jamId,
                    playerManager: this.attributes.playermanager
                };
                this.handleTopbar();
                this._createController("production", options).then(_.bind(this._showController, this, "production", options));
            }, this));
        },

        showJam: function (jamId) {
            this.handleConnection(_.bind(function () {
                var options = {
                    mode: 'show',
                    jamId: jamId,
                    playerManager: this.attributes.playermanager
                };
                this.handleTopbar();
                this._createController("production", options).then(_.bind(this._showController, this, "production", options));
            }, this));
        },

        createJam: function () {
            this.handleConnection(_.bind(function () {
                var options = {
                    mode: 'create',
                    playerManager: this.attributes.playermanager
                };
                this.handleTopbar();
                this._createController("production", options).then(_.bind(this._showController, this, "production", options));
            }, this));
        },

        showProfil: function (profilId) {
            this.handleConnection(_.bind(function () {

                var options = {
                    profilId: profilId
                };
                this.handleTopbar();
                this._createController("profil", options).then(_.bind(this._showController, this, "profil", options));
            }, this));
        },

        showFriends: function () {
            this.handleConnection(_.bind(function () {
                this.handleTopbar();
                this._createController("friendlist").then(_.bind(this._showController, this, "friendlist"));
            }, this));
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

        _showController: function (page, options) {
            this._closeControllersExcept(page);

            this.controllers[page].show(options);
        },

        _closeControllersExcept: function (controllerName) {
            var toClose = _.without(this.controllerNames, controllerName);

            this._closeControllers(toClose);
        },

        _closeControllers: function (controllerNames) {
            if (!_.isArray(controllerNames)) {
                controllerNames = [controllerNames];
            }

            if (this.controllers) {
                _.each(controllerNames, function (controllerName) {
                    if (this.controllers[controllerName]) {
                        this.controllers[controllerName].close();
                        delete this.controllers[controllerName];
                    }
                }, this);
            }
        },

        _initializeAttributes: function () {
            this.controllers = {};
            this.attributes = {};
            this.attributes.authmanager = new AuthManager();
            this.attributes.playermanager = new PlayerManager();
        },

        _bindEvents: function () {
            // this.listenTo(vent, 'actualize:appdata', function () {
            //     console.log('[Controller > actualize:appdata]');
            //     AppData.fetchUser();
            // });
        },

        path: function (page) {
            return "modules/" + page + "/" + page + "_controller";
        }

    });

    return MainController;
});


// TODO :
// Gestion des images
// Donner au jam l'url de l'image diret => soit c'est un facebook id, soit un URL vers l'image
