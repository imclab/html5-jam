/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');

    var JamCollection = require('modules/common/collections/jams');

    var JamView = Marionette.ItemView.extend({
        className: 'jam-element',

        template: 'common/jam'
    });

    var JamListView = Marionette.CollectionView.extend({

        itemView: JamView,

        initialize: function () {
            this.collection = new JamCollection();
        }

    });

    return JamListView;
});
