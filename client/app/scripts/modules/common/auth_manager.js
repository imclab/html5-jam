/*global define*/
define(function (require) {

    var $ = require('jquery');
    var Const = require('modules/common/constants');
    var User = require('modules/common/models/user');
    var CookieManager = require('modules/common/cookie_manager');

    var AuthManager = function () {

        var cookie_manager = new CookieManager();

        return {
            handleConnection: function () {
                return this.isConnected();
            },

            onServerResponse: function (key) {
                console.log("onServerResponse : ", key);
                this.setAuthenticationCookie(key);
            },

            configureAjaxRequest: function (key) {
                $.ajaxSetup({
                    headers: {
                        'Authorization' : key
                    }
                });

                new User().fetch({ url: '/coucou' });
            },

            isConnected: function () {
                var cookie_val = this.checkAuthenticationCookie();

                if (!cookie_val) {
                    // No auth cookie found
                    return undefined;
                }

                return cookie_val;
            },

            checkAuthenticationCookie: function () {
                return cookie_manager.get(Const.COOKIE_AUTH);
            },

            setAuthenticationCookie: function (val) {
                cookie_manager.set(Const.COOKIE_AUTH, val, Const.COOKIE_DURATION_YEAR);
            },

            getUser: function () {
                return new User({ username: 'JesuisunHiboux' });
            }
        };
    };

    return AuthManager;
});