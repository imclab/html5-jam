define(function (require) {

    var Backbone = require('backbone');

    var VideoInfo = Backbone.Model.extend({

        defaults: {
            cover: "../images/offlinecontent/thumb_example.png",
            username: "Anonymous",
            comment: "..."
        }

    });

    var Video = Backbone.Model.extend({

        defaults: {
            video_blob: "",
            audio_blob: "",
            _cid: ''
        },

        initialize: function () {
            this.set({
                _cid: this.cid
            });

            console.log("test :", this.get('_cid'));
        }

    });

    var VideoCollection = Backbone.Collection.extend({

        model: Video

    });

    return {
        VideoInfoModel: VideoInfo,
        VideoModel: Video,
        VideoCollection: VideoCollection
    };

});