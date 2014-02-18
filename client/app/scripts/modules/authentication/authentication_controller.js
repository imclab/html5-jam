/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var User = require('modules/common/models/user');
    var LoginView = require('modules/authentication/views/login_view');

    var BaseController = Marionette.Controller.extend({

        initialize: function (options) {
            this._initializeAttributes();

            this.auth.user = options.user || new User();
        },

        show: function () {
            var login_view = LoginView();
            login_view.render();
        },

        _initializeAttributes: function () {
            this.auth = {};
        },

        requestFacebookAuth: function () {
            // On fecth l'addresse /api/auth/facebook
            $.ajax({
                type: "GET",
                url: "/api/auth/facebook",
                data: {}
            }).done(function (msg) {
                console.log('Message : ', msg);
            }).fail(function (jqXHR, msg) {
                console.log('[AuthenticationController > requestFacebookAuth] Error with ajax GET : ', msg);
            });
        },

        isAuthentified: function (success, error) {
            var auth_token = this._checkForAuthenticationCookie();

            if (!auth_token) {
                // Not authentified
                error();
            } else {
                // Verified the cookie
                // Faire la requete
            }
        },

        _checkForAuthenticationCookie: function () {
            return this._getCookie('__auth');
        },

        createAuthenticationCookie: function (sValue) {
            // For one year
            this._setCookie('__auth', sValue, 365);
        },

        _setCookie: function (sName, sValue, days) {
            var today = new Date();
            var expires = new Date();

            expires.setTime(today.getTime() + (days*24*60*60*1000));
            document.cookie = sName + "=" + sValue + "; expires=" + expires.toGMTString();
        },

        _eraseCookie: function (sName) {
            this._setCookie(sName, "", -1);
        },

        _getCookie: function (sName) {
            var regularExp = new RegExp("(?:; )?" + sName + "=([^;]*);?");
     
            if (regularExp.test(document.cookie)) {
                return decodeURIComponent(RegExp["$1"]);
            } else {
                return null;
            }
        },

        onClose: function () {
            this.stopListening();
        }
    });

    return BaseController;

});
