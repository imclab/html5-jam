/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var User = require('modules/common/models/user');
    var LoginView = require('modules/login/views/login_view');
    var CookieManager = require('modules/common/cookie_manager');

    var LogInController = Marionette.Controller.extend({

        initialize: function (options) {
            this._initializeAttributes();

            this.auth.user = options.user || new User();
        },

        show: function () {
            this.view = new LoginView();
            this.view.render();
        },

        _initializeAttributes: function () {
            this.auth = {};
        },

        isAuthentified: function (success, error) {
            var auth_token = CookieManager.get('__auth');

            if (!auth_token) {
                // Not authentified
                error();
            } else {
                // Verified the cookie
                // Faire la requete
            }
        },

        onClose: function () {
            this.stopListening();
        }
    });

    return LogInController;

});
