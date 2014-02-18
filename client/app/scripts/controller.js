/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var ProductionController = require('modules/production/production_controller');
    var TopBarController = require('modules/topbar/topbar_controller');
    var FriendlistController = require('modules/friendlist/friendlist_controller');
    var ProfilController = require('modules/profil/profil_controller');
    var AuthenticationController = require('modules/common/controllers/authentication_controller');

    var User = require('modules/common/models/user');

    var MainController = Marionette.Controller.extend({

        initialize: function (options) {
            this.regions = options.regions || {};

            this._initializeAttributes();

            this.attributes.models.user = new User({ username: 'JeSuisUnChat' });

            this._createTopbarController();

            var t = new AuthenticationController();
            // t._eraseCookie('__auth');
            // t.createAuthenticationCookie('tchatchatcha');
            // t.checkForCookie();
            t.requestFacebookAuth();
        },

        _initializeAttributes: function () {
            this.controllers = {};
            this.attributes = {};
            this.attributes.models = {};
        },

        showIndex: function () {
            this._createProductionController();
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
