/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');

    var Jam = require('modules/common/models/jam');

    var JamView = Marionette.ItemView.extend({
        className: 'jam-element',

        template: 'common/jam'
    });

    var JamListView = Marionette.CollectionView.extend({

        itemView: JamView,

        initialize: function () {
            this.collection = new Jam.JamCollection();
        }

    });

    return JamListView;
});
