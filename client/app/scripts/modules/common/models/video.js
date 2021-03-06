/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');

    var Video = Backbone.Model.extend({

        defaults: {
            description: '',
            audio: {},
            video: {},
            video_blob: '',
            audio_blob: '',
        },

        sync: function (method, model, options) {
            // console.log('::SYNC:: Method  [Video] : ', method);
            // console.log('::SYNC:: Model [Video] : ', model);
            // console.log('::SYNC:: Options [Video] : ', options);

            if (method === 'create') {
                options.url = '/api/jams/' + options.jamId + '/videos';
            } else if (method === 'delete') {
                options.url = '/api/jams/' + this.get("jamId") + '/videos/' + this.id;
            } else if (method === 'read') {
                options.url = '/api/jams/' + this.get("jamId") + '/videos/' + this.id;
            } else if (method === 'update') {
                options.url = '/api/jams/' + this.get("jamId") + '/videos/' + this.id;
            }

            return Backbone.sync(method, model, options);
        }

    });

    return Video;

});
