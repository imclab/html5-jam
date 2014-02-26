/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var Backbone = require('backbone');
    var vent = require('modules/common/vent');

    var ProductionController = require('modules/production/production_controller');
    var TopBarController = require('modules/topbar/topbar_controller');
    var FriendlistController = require('modules/friendlist/friendlist_controller');
    var ProfilController = require('modules/profil/profil_controller');
    var LoginController = require('modules/login/login_controller');

    var User = require('modules/common/models/user');
    var AuthManager = require('modules/common/auth_manager');

    var Cook = require('modules/common/cookie_manager');

    var AppData = require('modules/common/app_data');

    var MainController = Marionette.Controller.extend({

        initialize: function (options) {
            this.regions = options.regions || {};
            this._initializeAttributes();

            Cook.flush();

            this.listenToOnce(vent, 'authentication:success', function (_id) {
                // Fetch the User by UserID
                AppData.user = new User();
                AppData.user.fetch({
                    url: 'api/users/' + _id,
                    success: function () {
                        vent.trigger('user:fetching:end');
                    },
                    error: function () {
                        // L'utilisateur n'existe pas dans la BDD
                        // Besoin de creer un profil
                    }
                });
            });
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
                Backbone.history.navigate('profil/', true);
            });

            this.attributes.authmanager.authenticationRequest(function (response) {
                console.log("Authentification SUCCEED : ", response);
                vent.trigger('authentication:success', response.id);
            }, function (xhr) {
                console.log("Authentication FAILED : ", xhr);
            });
        },

        showLogin: function () {
            this._createLoginController();
        },

        showIndex: function () {
            this.handleConnection();
            this._createTopbarController();
            this._createProfilController();
        },

        showJam: function (jamId) {
            this.handleConnection();
            this._createTopbarController();
            this._createProductionController({
                jam_id: jamId
            });

        },

        showProfil: function (profilId) {
            this.handleConnection();
            this._createTopbarController();
            this._createProfilController({
                profil_id: profilId
            });
        },

        showFriends: function () {
            this.handleConnection();
            this._createTopbarController();
            this._createFriendlistController();
        },

        _createLoginController: function (options) {
            if (!this.controllers.login) {
                options = options || {};

                this.controllers.login = new LoginController(options);
                this.controllers.login.show();
            } else {
                this.controllers.login.show();
            }
        },

        _createProductionController: function (options) {
            if (!this.controllers.production) {
                options = options || {};

                options.region = this.regions.corpus;
                options.user = AppData.user;

                this.controllers.production = new ProductionController(options);
                this.controllers.production.show();
            } else {
                this.controllers.production.show();
            }
        },

        _createTopbarController: function (options) {
            if (!this.controllers.topbar) {
                options = options || {};

                // options.region = this.regions.topbar;
                options.user = AppData.user;

                this.controllers.topbar = new TopBarController(options);
                this.controllers.topbar.show();
            }
        },

        _createFriendlistController: function (options) {
            if (!this.controllers.friendlist) {
                options = options || {};

                options.region = this.regions.corpus;
                options.user = AppData.user;

                this.controllers.friendlist = new FriendlistController(options);
                this.controllers.friendlist.show();
            } else {
                this.controllers.friendlist.show();
            }
        },

        _createProfilController: function (options) {
            if (!this.controllers.profil) {
                options = options || {};

                options.region = this.regions.corpus;
                options.user = AppData.user;

                this.controllers.profil = new ProfilController(options);
                this.controllers.profil.show();
            } else {
                this.controllers.profil.show();
            }
        },

        _initializeAttributes: function () {
            this.controllers = {};
            this.attributes = {};
            this.attributes.models = {};
            this.attributes.authmanager = new AuthManager();
        }

    });

    return MainController;
});
