/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');

    var LoginView = Marionette.ItemView.extend({
        template: 'authentication/login',

        el: '#login'
    });

    return LoginView;

});
