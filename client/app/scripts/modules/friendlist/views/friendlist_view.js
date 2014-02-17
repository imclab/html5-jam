/*global define*/
define(function (require) {
    "use strict";

    var Marionette = require('marionette');

    var Stamp = require('modules/friendlist/models/stamp');

    var StampView = Marionette.ItemView.extend({
        className: 'stamp-element',

        template: 'friendlist/stamp'
    });

    var StampListView = Marionette.CollectionView.extend({

        itemView: StampView,

        initialize: function () {
            this.collection = new Stamp.StampCollection();
        }

    });

    return StampListView;

});
