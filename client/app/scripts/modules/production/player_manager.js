/*global define*/
/*global navigator*/
/*global window*/
define(function (require) {

    var vent = require('modules/common/vent');
    var Backbone = require('backbone');

    var PlayerManager = function (options) {
        options = options || {};

        this.recorder = options.recorder || {audio: undefined, video: undefined, isRecording: false};
        this.selectedIds = options.selectedIds || {};

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
            _.each(this.selectedIds, function (key) {
                key.video.play();
                key.audio.play();
            });
        },

        stop: function () {
            _.each(this.selectedIds, function (key) {
                if (key.video && key.audio) {
                    key.video.pause();
                    key.audio.pause();
                    key.video.currentTime = 0;
                    key.audio.currentTime = 0;
                }
            });

            if (this.recorder.isRecording) {
                this.stopRecording();
            }
        },

        record: function () {
            this.playAllSelected();
            this.startRecording({
                video: true,
                audio: true
            });
        },

        startRecording: function (options) {
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

        stopRecording: function () {
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
                        _.extend(options , {
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

                        console.log("[PlayerManager > stopRecorder] VIDEO AND AUDIO LOADED");
                        _this.recorder.isRecording = false;
                        vent.trigger("video:new", options);
                    });
                });
            }
        },

        initializeMediaCapture: function () {
            if (!this.recorderBlob) {
                this.recorderPreview = document.getElementById('preview');
                this.recorderPreview.muted = true;

                var self = this;

                navigator.getUserMedia({audio: true, video: true}, function (media) {
                    self.recorderPreview.src = window.URL.createObjectURL(media);
                    self.recorderPreview.play();

                    self._setRecorderBlob(media);
                }, function () {
                    console.log("[Production_controller.js > _initializeMediaCapture] ERROR : Failed to get the blob.");
                });
            } else {
                this.recorderPreview = document.getElementById('preview');
                this.recorderPreview.muted = true;
                this.recorderPreview.src = window.URL.createObjectURL(this.recorderBlob);
                this.recorderPreview.play();
            }
        },

        _initializeRecordRTC: function () {
            this.recorder.audio = RecordRTC(this.recorderBlob, {
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