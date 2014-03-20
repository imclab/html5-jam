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
    var HomeController = require('modules/home/home_controller');

    var AuthManager = require('modules/common/auth_manager');

    var Cook = require('modules/common/cookie_manager');

    var AppData = require('modules/common/app_data');

    var MainController = Marionette.Controller.extend({

        initialize: function (options) {
            this.regions = options.regions || {};
            this._initializeAttributes();

            this.listenTo(vent, 'actualize:appdata', function () {
                console.log('[Controller > actualize:appdata]');
                AppData.fetchUser();
            });

            this.listenToOnce(vent, 'authentication:success', function (_id) {
                // Fetch the User by UserID
                AppData.initUser(_id);
                AppData.fetchUser();
            });

            this.listenTo(vent, 'authentication:fail', function () {
                Backbone.history.navigate('login/', true);
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
            this._createLoginController();
        },

        showIndex: function () {
            this.handleConnection();
            this._createTopbarController();
            this._createHomeController();
        },

        editJam: function (jamId) {
            this.handleConnection();
            this._createTopbarController();
            this._createProductionController({
                type: 'edit',
                jam_id: jamId
            });
        },

        showJam: function (jamId) {
            this.handleConnection();
            this._createTopbarController();
            this._createProductionController({
                type: 'show',
                jam_id: jamId
            });
        },

        createJam: function () {
            this.handleConnection();
            this._createTopbarController();
            this._createProductionController({
                type: 'create'
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

        showAboutDialog: function () {
            console.log('ici')
        },

        showLegalDialog: function () {

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
                this.controllers.production.show({
                    type: options.type,
                    jam_id: options.jam_id
                });
            } else {
                this.controllers.production.show({
                    type: options.type,
                    jam_id: options.jam_id
                });
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
                this.controllers.profil.show({
                    profilId: options.profil_id
                });
            } else {
                this.controllers.profil.show({
                    profilId: options.profil_id
                });
            }
        },

        _createHomeController: function (options) {
            if (!this.controllers.home) {
                options = options || {};

                options.region = this.regions.corpus;
                options.user = AppData.user;

                this.controllers.home = new HomeController(options);
                this.controllers.home.show();
            } else {
                this.controllers.home.show();
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
