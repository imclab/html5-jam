/*global define*/
/*global navigator*/
/*global window*/
define(function (require) {
    "use strict";

    var vent = require('modules/common/vent');
    var Backbone = require('backbone');

    var Const = {
        NONE: "none",
        PENDING: "pending",
        VALIDATED: "validated",
        REFUSED: "refused"
    };

    var PlayerManager = function (options) {
        options = options || {};

        this.recorder = options.recorder || {audio: undefined, video: undefined, isRecording: false};
        this.selectedIds = options.selectedIds || {};
        this.mediaRequest = Const.NONE;

        this.initialize.apply(this, arguments);
    };

    _.extend(PlayerManager.prototype, Backbone.Events, {

        initialize: function () {
            this.listenTo(vent, 'recorder:play', this.playAllSelected);
            this.listenTo(vent, 'recorder:stop', this.stop);
            this.listenTo(vent, 'recorder:record', this.record);
            this.listenTo(vent, 'recorder:initMediaCapture', this.initializeMediaCapture);
        },

        playAllSelected: function () {
            console.log("Play pushed : ", this.selectedIds);
            _.each(this.selectedIds, function (key) {
                key.play();
            });
        },

        stop: function () {
            _.each(this.selectedIds, function (key) {
                key.pause();
                key.currentTime = 0;
            });

            if (this.recorder.isRecording) {
                this._stopRecording();
            }
        },

        record: function () {
            this.playAllSelected();
            this._startRecording({
                video: true,
                audio: true
            });
        },

        _startRecording: function (options) {
            if (options) {
                if (options.video === true) {
                    this.recorder.video.startRecording();
                }

                if (options.audio === true) {
                    this.recorder.audio.startRecording();
                }
            }

            this.recorder.isRecording = true;
            $('.recbtn').addClass('btn-warning').removeClass('btn-danger');
        },

        _stopRecording: function () {
            var options = {};

            if (this.recorder.isRecording) {
                this.recorder.audio.stopRecording(function (audioUrl) {
                    // console.log("Link Audio : ", audioUrl);
                    options.audio_blob = audioUrl;
                });
                this.recorder.video.stopRecording(function (videoUrl) {
                    // console.log("Link Video : ", videoUrl);
                    options.video_blob = videoUrl;
                });

                var _this = this;

                this.recorder.audio.getDataURL(function (audioDataURL) {
                    _this.recorder.video.getDataURL(function (videoDataURL) {
                        _.extend(options, {
                            audio: {
                                name: "",
                                type: "audio/wav",
                                contents: audioDataURL
                            },
                            video: {
                                name: "",
                                type: "video/webm",
                                contents: videoDataURL
                            }
                        });

                        // console.log("[PlayerManager > stopRecorder] VIDEO AND AUDIO LOADED");
                        _this.recorder.isRecording = false;
                        vent.trigger("video:new", options);
                    });
                });
            }
        },

        initializeMediaCapture: function () {
            this.recorderPreview = document.getElementById('preview');
            this.recorderPreview.muted = true;

            if (this.recorderBlob) {
                this.recorderPreview.src = window.URL.createObjectURL(this.recorderBlob);
                this.recorderPreview.play();
            } else if (this.mediaRequest === Const.REFUSED || this.mediaRequest === Const.NONE) {
                var self = this;
                this.mediaRequest = Const.PENDING;
                navigator.getUserMedia({audio: true, video: true}, function (media) {
                    self.mediaRequest = Const.VALIDATED;
                    console.log("[Production_controller.js > _initializeMediaCapture] SUCCESS");
                    self.recorderPreview.src = window.URL.createObjectURL(media);
                    self.recorderPreview.play();

                    self._setRecorderBlob(media);
                }, function () {
                    self.mediaRequest = Const.REFUSED;
                    console.log("[Production_controller.js > _initializeMediaCapture] ERROR : Failed to get the blob");
                });
            }
        },

        _initializeRecordRTC: function () {
            this.recorder.audio = RecordRTC(this.recorderBlob, {
                type: 'audio',
                bufferSize: 16384
            });

            this.recorder.video = RecordRTC(this.recorderBlob, {
                type: 'video'
            });
        },

        _setRecorderBlob: function (obj) {
            this.recorderBlob = obj;
            this._initializeRecordRTC();
        }
    });

    return PlayerManager;
});