/*global define*/
define(function (require) {
    "use strict";

    var Like = require('modules/common/models/like');

    var LikeManager = function () {
        return {
            likeJam: function (jamId) {
                new Like({
                    jamId: jamId
                }).save({}, {
                    success: function (xhr) {
                        console.log('::success::', xhr);
                    },
                    error: function (err) {
                        console.log("We have an error :", err);
                    }
                });
            },

            dislikeJam: function (jamId) {
                new Like({
                    id: '',
                    jamId: jamId
                }).destroy({
                    success: function (xhr) {
                        console.log('::success::', xhr);
                    },
                    error: function (err) {
                        console.log("We have an error :", err);
                    }
                });
            }
        };
    };

    return LikeManager();
});