/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');

    var Video = Backbone.Model.extend({

        defaults: {
            cover: '../images/offlinecontent/thumb_example.png',
            userId: 101,
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
            console.log('Model : ', model);
            console.log('Options : ', options);

            if (method === 'create') {
                options.url = '/api/jams/' + options.jamId + '/videos';
            }

            return Backbone.sync(method, model, options);
        }

    });

    return Video;

});
