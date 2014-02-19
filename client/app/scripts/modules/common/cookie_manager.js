/*global define*/
define(function (require) {

    var CookieManager = function () {

        return {
            set: function (sName, sValue, days) {
                var today = new Date();
                var expires = new Date();

                expires.setTime(today.getTime() + (days * 24 * 60 * 60 * 1000));
                document.cookie = sName + "=" + decodeURIComponent(sValue) + "; expires=" + expires.toGMTString();
            },

            remove: function (sName) {
                this.set(sName, "", -1);
            },

            get: function (sName) {
                var regularExp = new RegExp("(?:; )?" + sName + "=([^;]*);?");

                if (regularExp.test(document.cookie)) {
                    return decodeURIComponent(RegExp['$1']);
                }

                return null;
            },

            flush: function () {
                var cookies = document.cookie.split(";");
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i];

                    var eqIndex = cookie.indexOf("=");
                    var sname = eqIndex > -1 ? cookie.substr(0, eqIndex) : cookie;
                    sname = sname.trim();
                    if(sname !== "language_libon" && sname !== "LOGINCOUNTRY"){
                        this.remove(sname);
                    }
                }
            }
        };

    };

    return CookieManager;

});