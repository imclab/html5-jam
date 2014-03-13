/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var Backbone = require('backbone');
    var vent = require('modules/common/vent');

    var JamView = require('modules/common/views/jam_view');

    var ProfilJamView = JamView.extend({
        template: 'profil/profil_jam'
    });

    return ProfilJamView;
});
