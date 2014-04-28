/*global define*/
define(function (require) {
    "use strict";

    var Like = require('modules/common/models/like');

    var LikeManager = function () {
        return {
            likeJam: function (jamId) {
                new Like({
                    jamId: jamId
                }).save();
            },

            dislikeJam: function (jamId) {
                new Like({
                    id: '',
                    jamId: jamId
                }).destroy();
            }
        };
    };

    return LikeManager();
});