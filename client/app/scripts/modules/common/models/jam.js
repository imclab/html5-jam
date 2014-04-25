/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');
    var moment = require('moment');

    var JamModel = Backbone.Model.extend({
        /* URL : /jam/:cid */
        defaults: {
            createdAt: '',
            description: '',
            name: null,
            privacy: false,
            updatedAt: '',
            userId: 0,
            star: 0,
            ownerFacebookId: 0,
            nbLikes: 0,
            doILikeIt: false
        },

        sync: function (method, model, options) {
            console.log('::SYNC:: Method [Jam] : ', method);

            if (method === 'create') {
                // Create a jam
                options.url = '/api/jams';
            } else if (method === 'update') {
                // Update a jam
                options.url = '/api/jams/' + model.id;
            } else if (method === 'delete') {
                // Remove a jam
                options.url = '/api/jams/' + model.id;
            }

            return Backbone.sync(method, model, options);
        },


        parse: function (response) {
            // console.log("PARSE Jam model : ", _.clone(response));

            // N'affecte pas le fetch depuis collection
            _.each(response.videos, function (video) {
                video.jamId = response.id;
                video.path = "api/jams/" + response.id + "/videos/" + video.id;
            });

            return response;
        },

        doILikeIt: function () {
            // Will server is sending 0 instead of FALSE :
            if (typeof this.get("doILikeIt") === "number") {
                return (this.get("doILikeIt") === 1) ? true : false;
            }

            return this.get("doILikeIt");
        },

        toJSON: function () {
            var data = Backbone.Model.prototype.toJSON.call(this);

            _.extend(data, {
                createdAt: moment(this.get("createdAt")).fromNow(),
                doILikeIt: this.doILikeIt()
            });

            return data;
        }

    });


    return JamModel;

});
