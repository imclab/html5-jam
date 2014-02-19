/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');

    var LoginView = Marionette.ItemView.extend({
        template: 'login/login',

        el: '#login',

        initialize: function () {
            if (this.$el.hasClass('hidden')) {
                this.$el.removeClass('hidden');
            }
        }
    });

    return LoginView;

});
