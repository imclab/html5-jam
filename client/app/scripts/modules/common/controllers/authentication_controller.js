/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var User = require('modules/common/models/user');

    var BaseController = Marionette.Controller.extend({

        initialize: function (options) {
            this._initializeAttributes();
        },

        _initializeAttributes: function () {
            this.auth = {};
            this.auth.cookie = {};
        },

        getFacebookAuth: function () {
            // On fecth l'addresse /api/auth/facebook
            this.auth.user.fetch({
                url: '/api/auth/facebook'
            });
        },

        checkForCookie: function () {
            this.auth.cookie.full = this._getCookie('__auth');
            // this.auth.cookie.auth = ;
            // this.auth.cookie.date = ;

            console.log("Mon cookie : ", );
        },

        createAuthenticationCookie: function (sValue) {
            this._setCookie('__auth', sValue);
        },

        _setCookie: function (sName, sValue) {
            var today = new Date();
            expires = new Date();

            expires.setTime(today.getTime() + (365*24*60*60*1000));

            document.cookie = sName + "=" + encodeURIComponent(sValue) + ";expires=" + expires.toGMTString();
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
