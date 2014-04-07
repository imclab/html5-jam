/*global define*/
define(function (require) {

    var Marionette = require("marionette");

    var LoadingView = Marionette.ItemView.extend({

        template: "common/loading",

        className: "loading-center",

        serializeData: function () {
          return {
            data: {}
          };
        }

    });

    return LoadingView;
});
