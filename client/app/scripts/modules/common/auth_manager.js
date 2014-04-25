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
                $.ajax({
                    url: '/api/me',
                    method: 'GET',
                    success: function (response) {
                        console.log("[AuthManager > authenticationRequest] SUCCESS", response);
                        vent.trigger('authentication:success', response.id);
                    },
                    error: function (xhr) {
                        console.log("[AuthManager > authenticationRequest] FAILED", xhr);
                        CookieManager.remove(Const.COOKIE_AUTH);
                        vent.trigger('authentication:fail');
                    }
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
