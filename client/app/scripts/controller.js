/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var Backbone = require('backbone');
    var Const = require('modules/common/constants');

    var LoadingView = require('modules/common/views/loading_view');
    var AuthManager = require('modules/common/auth_manager');
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
                    jamId: jamId
                };
                this.handleTopbar();
                this._createController("production", options).then(_.bind(this._showController, this, "production", options));
            }, this));
        },

        showJam: function (jamId) {
            this.handleConnection(_.bind(function () {
                var options = {
                    mode: 'show',
                    jamId: jamId
                };
                this.handleTopbar();
                this._createController("production", options).then(_.bind(this._showController, this, "production", options));
            }, this));
        },

        createJam: function () {
            this.handleConnection(_.bind(function () {
                var options = {
                    mode: 'create',
                    call: this.attributes.call++
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
            this.attributes.models = {};
            this.attributes.call = 0;
            this.attributes.authmanager = new AuthManager();
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

// Pour faire joujou sans connexion :
// http://0.0.0.0:8888/#?token=8310ee3e4f0353b5c11dc69630833901715bbbc8b698aa32a168d00811c90377b5bc894f942fca64fb4eeb1a71a5dbcb4475a9d63bef9442b7a797483307d0f9468326058894d8826811dc07afd4165232960aee809a6162c3e5fb613ec32fc4689e7cf8110b0540047579b878ba2ed4e36af956292a834117c273022efdbb6bb4443d25ddb31ad52802269849e7fda8e5b0d3fde0cc647093cb5e90a7d6935e5a5d3a81523df1c5b566978a7d34109c4fc55156cafe5c1a8aaa94c7f978cd5c5fa19e4c182f9b164f840af12883a1e5
