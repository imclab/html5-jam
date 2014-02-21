/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');

    var ProductionController = require('modules/production/production_controller');
    var TopBarController = require('modules/topbar/topbar_controller');
    var FriendlistController = require('modules/friendlist/friendlist_controller');
    var ProfilController = require('modules/profil/profil_controller');
    var LoginController = require('modules/login/login_controller');

    var User = require('modules/common/models/user');
    var AuthManager = require('modules/common/auth_manager');

    var Cook = require('modules/common/cookie_manager')();

    var MainController = Marionette.Controller.extend({

        initialize: function (options) {
            this.regions = options.regions || {};
            this._initializeAttributes();

            this.handleLogin();
        },

        _initializeAttributes: function () {
            this.controllers = {};
            this.attributes = {};
            this.attributes.models = {};
            this.attributes.authmanager = new AuthManager();
        },

        getIdentityToken: function (identityToken) {
            var token = identityToken.replace('?token=', '');
            this.attributes.authmanager.onServerResponse(token);
        },

        handleLogin: function () {
            var client = this.attributes.authmanager.handleConnection();

            if (!client) {
                this._createLoginController();
            } else {
                this.attributes.models.user = new User({ usrId : client.usr_id });
                //this.attributes.models.user.fetch();
                this._createTopbarController();
                this._createProductionController();
            }
        },

        showLogin: function () {
            this._createLoginController();
        },

        showIndex: function () {
            //this._createProductionController();
        },

        showJam: function (jamId) {
            // Get the project
            // Launch the productionController
            this._createProductionController({
                jam_id: jamId
            });
        },

        showProfil: function (profilId) {
            this._createProfilController({
                profil_id: profilId
            });
        },

        showFriends: function () {
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
                options.user = this.attributes.models.user;

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
                options.user = this.attributes.models.user;

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
                options.user = this.attributes.models.user;

                this.controllers.profil = new ProfilController(options);
                this.controllers.profil.show();
            } else {
                this.controllers.profil.show();
            }
        }

    });

    return MainController;
});
