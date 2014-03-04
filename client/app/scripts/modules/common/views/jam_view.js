/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');
    var Backbone = require('backbone');
    var vent = require('modules/common/vent');

    var JamCollection = require('modules/common/collections/jams');

    var JamView = Marionette.ItemView.extend({
        className: 'jam-element',

        template: 'common/jam',

        events: {
            'click .jamName' : 'redirection'
        },

        redirection: function () {
            Backbone.history.navigate('jam/' + this.model.id, true);
        }
    });

    var JamListView = Marionette.CollectionView.extend({

        itemView: JamView,

        initialize: function () {
            this.collection = new JamCollection();
        }

    });

    return JamListView;
});
