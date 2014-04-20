/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var Backbone = require('backbone');
    var vent = require('modules/common/vent');

    var JamCollection = require('modules/common/collections/jams');

    var JamListView = Marionette.CollectionView.extend({

        initialize: function (options) {
            if (options && options.view) {
                this.itemView = options.view;
            } else {
                this.itemView = require('modules/common/views/jam_view');
            }

            this.collection = new JamCollection();
        }
    });

    return JamListView;
});
