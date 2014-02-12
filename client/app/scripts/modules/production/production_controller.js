/*global define*/
/*global navigator*/
/*global window*/
define(function (require) {
    'use strict';

    var _ = require('underscore');
    var RecorderView = require('modules/production/views/recorder_view');
    var SideBarView = require('modules/production/views/sidebar_view');
    var CommentsView = require('modules/production/views/comments_view');
    var Video = require('modules/common/models/video');
    var vent = require('modules/common/vent');
    var BaseController = require('modules/common/controllers/base_controller');
    var ProductionLayout = require('modules/production/views/production_layout');

    var RecorderController = BaseController.extend({

        initialize: function (options) {
            BaseController.prototype.initialize.call(this, options);

            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.getUserMedia;

            this._initializeAttributes();
            this._bindEvents();
        },

        show: function () {
            BaseController.prototype.show.call(this);
            this._initMediaCapture();
        },

        getLayout: function () {
            var productionLayout = new ProductionLayout();

            this.listenTo(productionLayout, 'show', function () {
                this.views.recorder = new RecorderView();
                this.views.sidebar = new SideBarView();
                this.views.comments = new CommentsView();

                productionLayout.recorder.show(this.views.recorder);
                productionLayout.sidebar.show(this.views.sidebar);
                productionLayout.comments.show(this.views.comments);
            });

            return productionLayout;
        },

        _bindEvents: function () {

            this.listenTo(vent, 'recorder:play', this.playAllSelected);
            this.listenTo(vent, 'recorder:stop', this.stop);
            this.listenTo(vent, 'recorder:record', this.record);

            this.listenTo(vent, 'player:remove', this.remove);

            this.listenTo(vent, 'video:new', function (options) {
                this.addSelectedId(
                    this.addNewVideoModel({
                        video_blob: options.video,
                        audio_blob: options.audio
                    })
                );
            });

        },

        addNewVideoModel: function (options) {
            var newModel = new Video.VideoModel(options);
            this.views.recorder.collection.add(newModel);
            return newModel;
        },

        addSelectedId:  function (model) {
            this.attributes.selectedIds[model.cid] = {};
            this.attributes.selectedIds[model.cid].video = document.getElementById("video-player-" + model.get('_cid'));
            this.attributes.selectedIds[model.cid].audio = document.getElementById("audio-player-" + model.get('_cid'));
        },

        _initializeAttributes: function () {
            this.attributes = {};
            this.attributes.recorderBlob = undefined;
            this.attributes.selectedIds = {};
            this.attributes.recorder = {
                audio: undefined,
                video: undefined,
                isRecording: false,
            };

            this.views = {};
        },

        _initMediaCapture: function () {
            var preview = document.getElementById('preview');
            preview.muted = true;

            var self = this;

            navigator.getUserMedia({audio: true, video: true}, function (media) {
                preview.src = window.URL.createObjectURL(media);
                preview.play();

                self._setRecorderBlob(media);
            }, function () {
                console.log("Error");
            });
        },

        _initializeRecordRTC: function () {
            this.attributes.recorder.audio = RecordRTC(this.attributes.recorderBlob, {
                bufferSize: 16384
            });

            this.attributes.recorder.video = RecordRTC(this.attributes.recorderBlob, {
                type: 'video'
            });
        },

        _setRecorderBlob: function (obj) {
            this.attributes.recorderBlob = obj;
            this._initializeRecordRTC();
        },

        playAllSelected: function () {
            _.each(this.attributes.selectedIds, function (key) {
                key.video.play();
                key.audio.play();
            });
        },

        stop: function () {
            _.each(this.attributes.selectedIds, function (key) {
                key.video.pause();
                key.audio.pause();
                key.video.currentTime = 0;
                key.audio.currentTime = 0;
            });

            if (this.attributes.recorder.isRecording) {
                vent.trigger('video:new', this.stopRecording());
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
                    this.attributes.recorder.video.startRecording();
                }

                if (options.audio === true) {
                    this.attributes.recorder.audio.startRecording();
                }
            }
            this.attributes.recorder.isRecording = true;
        },

        stopRecording: function () {
            var options = {};

            if (this.attributes.recorder.isRecording) {
                this.attributes.recorder.audio.stopRecording(function (audioUrl) {
                    console.log("Link Audio : ", audioUrl);
                    options.audio = audioUrl;
                });
                this.attributes.recorder.video.stopRecording(function (videoUrl) {
                    console.log("Link Video : ", videoUrl);
                    options.video = videoUrl;
                });

                this.attributes.recorder.isRecording = false;
            }

            return options;
        },

        remove: function (model) {
            this.views.recorder.collection.remove(model);
            delete this.attributes.selectedIds[model.cid];
        }

    });

    return RecorderController;

});
