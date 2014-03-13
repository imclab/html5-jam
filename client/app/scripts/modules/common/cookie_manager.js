/*global define:false*/
define(function () {

    var CookieManager = function () {

        return {

            set: function (name, value, expires, path, domain, secure) {
                expires = (expires !== undefined) ? expires : null;
                path = (path !== undefined) ? path : "/";
                domain = (domain !== undefined) ? domain : null;
                secure = (secure !== undefined) ? secure : false;

                document.cookie = name.trim() + "=" + encodeURIComponent(value) + ((expires === null) ? "" : ("; expires=" + expires.toGMTString())) + ((path === null) ? "" : ("; path=" + path)) + ((domain === null) ? "" : ("; domain=" + domain)) + ((secure === true) ? "; secure" : "");
            },

            get: function (name) {
                var arg = name.trim() + "=",
                    alen = arg.length,
                    clen = document.cookie.length,
                    i = 0,
                    j = 0;

                while (i < clen) {
                    j = i + alen;
                    if (document.cookie.substring(i, j) === arg) {
                        return this.getCookieVal(j);
                    }
                    i = document.cookie.indexOf(" ", i) + 1;
                    if (i === 0) {
                        break;
                    }
                }

                return null;
            },

            remove: function (name, path) {
                path = path || "/";
                // console.log("[Cookie Manager] delete ", name, path);
                document.cookie = name.trim() + "=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=" + path;
            },

            flush: function () {
                var i = 0;
                var cookies = document.cookie.split(";");
                for (i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i];

                    var eqIndex = cookie.indexOf("=");
                    var name = eqIndex > -1 ? cookie.substr(0, eqIndex) : cookie;
                    name = name.trim();
                    CookieManager.remove(name);
                }
            },

            getCookieVal: function (offset) {
                var endstr = document.cookie.indexOf(";", offset);
                if (endstr === -1) {
                    endstr = document.cookie.length;
                }

                return unescape(document.cookie.substring(offset, endstr));
            }
        };
    }();

    return CookieManager;

});
