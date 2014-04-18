/*global define*/
define(function (require) {
    "use strict";

    var KeyboardManager = {
        initKeyboardManager: function () {
            this.keydata = {
                tab: [],
                handlers: {}
            };

            var onPressedKey = _.bind(function (e) {
                var val = _.find(this.keydata.tab, function (key) { return key === e.keyCode; });
                if (val) { this.keydata.handlers[val](); }
            }, this);

            $(document).keypress(onPressedKey);
        },

        setKeyHandler: function (keyCode, callback) {
            var key = (typeof keyCode === "number") ? keyCode : keyCode.charCodeAt(0);
            this.keydata.tab = _.union(this.keydata.tab, [key]);
            this.keydata.handlers[key] = callback;
        },

        closeKeyboardManager: function () {
            this.keydata = {
                tab: [],
                handlers: {}
            };
        }

    };

    return KeyboardManager;
});
