/*global define*/
define(function (require) {
    var Marionette = require("marionette");

    var BaseController = Marionette.Controller.extend({

        initialize: function (options) {
            this.region = options.region;
        },

        show: function () {
            this.layout = this._getLayout();
            if (this.region && this.layout) {
                this.region.show(this.layout);
            }
        },

        onClose: function () {
            this._closeLayout();
            this.stopListening();
        },

        _getLayout: function () {
            this._closeLayout();
            var layout = this.getLayout();
            return layout;
        },

        _closeLayout: function () {
            if (this.layout) {
                this.layout.close();
                delete this.layout;
            }
        }
    });

    return BaseController;

});
