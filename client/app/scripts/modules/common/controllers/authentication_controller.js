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
        },

        _getFacebookAuth: function () {
            // On fecth l'addresse /api/auth/facebook
            this.auth.user.fetch({
                url: '/api/auth/facebook'
            });
        },

        _checkForCookie: function () {

        },

        _createCookie: function (cookie) {

        },

        onClose: function () {
            this.stopListening();
        }
    });

    return BaseController;

});
