/*global define*/
define(function (require) {

    var $ = require('jquery');
    var Const = require('modules/common/constants');
    var User = require('modules/common/models/user');
    var CookieManager = require('modules/common/cookie_manager');

    var AuthManager = function () {

        return {
            handleConnection: function () {
                return this.isConnected();
            },

            isConnected: function () {
                var cookie_val = this.checkAuthenticationCookie();

                if (!cookie_val) {
                    // No auth cookie found
                    return;
                }

                return cookie_val;
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
            },

            getUser: function () {
                var usr = new User();
                usr.fetch();
                return usr;
            }
        };
    };

    return AuthManager;
});