/*global define*/
define(function (require) {

    var $ = require('jquery');
    var vent = require('modules/common/vent');
    var Const = require('modules/common/constants');
    var User = require('modules/common/models/user');
    var CookieManager = require('modules/common/cookie_manager');

    var AuthManager = function () {

        return {

            handleConnection: function () {
                return this.isConnected();
            },

            isConnected: function () {
                var auth_cookie_val = this.checkAuthenticationCookie();

                if (!auth_cookie_val) {
                    // No auth cookie found
                    return;
                }

                // Check if the user exist
                $.ajax({
                    url: '/api/me',
                    method: 'GET',
                    success: function (response) {
                        console.log("Authentification SUCCED : ", response);
                        vent.trigger('authentication:success', response.name);
                    },
                    error: function (xhr) {
                        console.log("Authentification FAILED : ", xhr);
                    }
                });

                return auth_cookie_val;
            },

            checkAuthenticationCookie: function () {
                return CookieManager.get(Const.COOKIE_AUTH);
            },

            setAuthenticationCookie: function (val) {
                var date = new Date();
                date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
                CookieManager.set(Const.COOKIE_AUTH, val, date);
            },

            removeAuthenticationCookie: function () {
                CookieManager.remove(Const.COOKIE_AUTH);
            }
        };
    };

    return AuthManager;
});