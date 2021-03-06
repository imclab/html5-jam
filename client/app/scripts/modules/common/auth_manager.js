/*global define*/
define(function (require) {

    var $ = require('jquery');
    var vent = require('modules/common/vent');
    var Const = require('modules/common/constants');
    var CookieManager = require('modules/common/cookie_manager');

    var AuthManager = function () {

        return {
            handleConnection: function () {
                return this.isConnected();
            },

            authenticationRequest: function () {
                // Check if the user exist
                return $.ajax({
                    url: '/api/me',
                    method: 'GET'
                });
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
