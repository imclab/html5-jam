/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');

    var JamModel = Backbone.Model.extend({
        /* URL : /jam/:cid */
        defaults: {
            videos: {},
            name: ''
        },

        parse: function (response) {
            return {
                videos: response.videos,
                name: response.name
            };
        },

        sync: function (method, model, options) {
            
        }
    });

    var JamCollection = Backbone.Collection.extend({

        model: JamModel,

        parse: function (response) {
            return response.list || [];
        },

        sync: function (method, collection, options) {
            var jam_url = '/jams/all';

            _.extend(options, {url: jam_url});

            return Backbone.sync.apply(this, arguments);
        }

    });

    return {
        JamModel: JamModel,
        JamCollection: JamCollection
    };

});
