/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');

    var Video = Backbone.Model.extend({

        defaults: {
            cover: '../images/offlinecontent/thumb_example.png',
            // description: '',
            // instrument: '',
            // active: '',
            // volume: '',

            video_blob: '',
            audio_blob: '',
            _cid: ''
        },

        initialize: function () {
            this.set({
                _cid: this.cid
            });
        },

        sync: function (method, model, options) {
            console.log('Method : ', method);

            if (method === 'create') {
                options.url = '/api/jams/' + options.jamId + '/videos';
            } else if (method === 'delete') {
                options.url = '/api/jams/228/videos/' + this.id;
            }

            return Backbone.sync(method, model, options);
        }

    });

    return Video;

});
