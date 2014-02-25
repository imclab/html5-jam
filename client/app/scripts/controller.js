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

            AppData.user = new User({ username: 'wait' });

            this.listenTo(vent, 'authentication:success', function (mod) {
                AppData.user.set('username', mod);
            });
        },

        handleConnection: function () {
            if (this.attributes.authmanager.isConnected()) {

            } else {
                Backbone.history.navigate('login/', true);
            }
        },

        handleToken: function (tokenId) {
            this.attributes.authmanager.setAuthenticationCookie(tokenId.replace('?token=', ''));
            Backbone.history.navigate('/', true);
        },

        showLogin: function () {
            this._createLoginController();
        },

        showIndex: function () {
            this.handleConnection();
            this._createTopbarController();
            this._createProductionController();
        },

        showJam: function (jamId) {
            this.handleConnection();
            this._createProductionController({
                jam_id: jamId
            });

        },

        showProfil: function (profilId) {

            this.whoAmI();

            this.handleConnection();
            this._createProfilController({
                profil_id: profilId
            });
        },

        showFriends: function () {
            this.handleConnection();
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
            } else {
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
