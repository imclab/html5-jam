/*global define*/
define(function (require) {

    var Marionette = require('marionette');
    var ProductionController = require('modules/production/production_controller');
    var TopBarController = require('modules/topbar/topbar_controller');

    var MainController = Marionette.Controller.extend({

        initialize: function(options) {
            this.regions = options.regions || {};
            this.controllers = {};

            this._createTopbarController();
        },

        showIndex: function () {
            this._createProductionController();
        },

        showJam: function (jamId) {
            // Get the project
            // Launch the productionController
        },

        showProfil: function (profilId) {

        },

        _createProductionController: function () {
            this.controllers.production = new ProductionController({
                region: this.regions.production
            });

            this.controllers.production.show();
        },

        _createTopbarController: function () {
            this.controllers.topbar = new TopBarController({
                region: this.regions.topbar
            });

            this.controllers.topbar.show();
        }


    });

    return MainController;

});
