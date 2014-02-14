/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');

    var SidebarView = Marionette.ItemView.extend({
        className: 'view-wrapper',

        template: 'friendlist/sidebar'
    });

    return SidebarView;

});
