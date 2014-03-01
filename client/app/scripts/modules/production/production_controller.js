/*global define*/
/*global navigator*/
/*global window*/
define(function (require) {
    'use strict';

    var _ = require('underscore');
    var BaseController = require('modules/common/controllers/base_controller');
    var vent = require('modules/common/vent');

    var ProductionLayout = require('modules/production/views/production_layout');
    var RecorderView = require('modules/production/views/recorder_view');
    var SideBarView = require('modules/production/views/sidebar_view');
    var CommentsView = require('modules/production/views/comments_view');
    var SelectedListView = require('modules/production/views/selected_video_view');
    var VideosListView = require('modules/production/views/jam_videos_list');

    var CommentModel = require('modules/production/models/comment');
    var CommentCollection = require('modules/production/collections/comments');
    var VideoModel = require('modules/common/models/video');
    var VideoCollection = require('modules/common/collections/videos');
    var Jam = require('modules/common/models/jam');

    var AppData = require('modules/common/app_data');

    var RecorderController = BaseController.extend({

        initialize: function (options) {
            BaseController.prototype.initialize.call(this, options);

            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.getUserMedia;

            this._initializeAttributes();
            this._bindEvents();
        },

        onShow: function () {
            // Common area
            console.log('[ProductionController > onShow] ' + this.attributes.type);
        },

        show: function (options) {

            if (options.jam_id) {
                // Existing project :
                this.attributes.jamId = options.jam_id;
            }

            switch (options.type) {
            case 'edit':
                this.getJamFromServer();
                BaseController.prototype.show.call(this);
                break;
            case 'show':
                this.getJamFromServer();
                BaseController.prototype.show.call(this);
                this._initializeMediaCapture();
                break;
            case 'create':
                BaseController.prototype.show.call(this);
                this._initializeMediaCapture();
                break;
            }
        },

        getLayout: function () {
            var productionLayout = new ProductionLayout();

            this.listenTo(productionLayout, 'show', function () {
                this.views.recorder = new RecorderView();
                this.views.sidebar = new SideBarView();
                this.views.comments = new CommentsView();
                this.views.selected_list = new SelectedListView();
                this.views.videos_list = new VideosListView();

                productionLayout.recorder.show(this.views.recorder);
                productionLayout.sidebar.show(this.views.sidebar);
                productionLayout.comments.show(this.views.comments);
                productionLayout.selected_list.show(this.views.selected_list);
                productionLayout.videos_list.show(this.views.videos_list);
            });

            return productionLayout;
        },

        _initializeAttributes: function () {
            this.views = {};
            this.attributes = {};
            this.attributes.recorderBlob = undefined;
            this.attributes.recorderPreview = undefined;
            this.attributes.selectedIds = {};
            this.attributes.models = {};

            this.attributes.recorder = {
                audio: undefined,
                video: undefined,
                isRecording: false,
            };
        },

        _bindEvents: function () {
            this.listenTo(vent, 'recorder:play', this.playAllSelected);
            this.listenTo(vent, 'recorder:stop', this.stop);
            this.listenTo(vent, 'recorder:record', this.record);
            this.listenTo(vent, 'recorder:save', this.save);

            this.listenTo(vent, 'player:remove', this.remove);

            this.listenTo(vent, 'comment:new', this.addComments);

            this.listenTo(vent, 'video:new', function (options) {
                this.addSelectedId(
                    this.addNewVideo({
                        video_blob: options.video,
                        audio_blob: options.audio
                    })
                );
            });
        },

        getJamFromServer: function () {
            // If it's not a new project
            // Need to :
            //          get the jam from the server with the jam_id
            //          get all the video from the jam
            //          get all the comments
            var self = this;

            this.attributes.models.jam = new Jam();
            this.attributes.models.videos = new VideoCollection();
            this.attributes.models.comments = new CommentCollection();

            this.attributes.models.jam.fetch({
                url: '/api/jams/' + self.attributes.jamId,
                success: function (xhr) {
                    console.log("[JAM:" + self.attributes.jamId + "] Fetching from server : jam.cid=" + self.attributes.models.jam.cid);
                    console.log("[xhr]: ", xhr);
                    self.views.videos_list.collection.add(self.attributes.models.jam.get('videos'));
                }
            });

            this.attributes.models.comments.fetch({
                url: '/api/jams/' + self.attributes.jamId + '/comments/',
                success: function (xhr) {
                    console.log('Comments : ', xhr);
                }
            });
        },

        _initializeSelectedList: function () {
            this.views.selected_list.collection = this.attributes.models.videos;
        },

        _initializeSidebar: function () {
            this.views.sidebar.collection = this.attributes.models.videos;
        },

        save: function () {
            if (!this.attributes.models.jam) {
                console.log("[Production_controller.js > save] ERROR : No Jam loaded");
            } else {
                // Actualise / create the jam
                // Save the video
                // Add the video to the jam
                // Reload la page
                console.log("[Production_controller.js > save] SUCCESS : ", this.attributes.selectedIds);

                // On envoit toutes les videos selectionnees au server
                this.views.recorder.collection.save({
                    jamId: this.attributes.jamId
                });
            }

            // On reinitialise tout => refetch du jam et pas besoin de passer un objet d'une vue a l'autre
        },

        addNewVideo: function (options) {
            var newModel = new VideoModel(options);
            this.views.recorder.collection.add(newModel);
            return newModel;
        },

        addSelectedId:  function (model) {
            this.attributes.selectedIds[model.cid] = {};
            this.attributes.selectedIds[model.cid].video = document.getElementById("video-player-" + model.get('_cid'));
            this.attributes.selectedIds[model.cid].audio = document.getElementById("audio-player-" + model.get('_cid'));
        },

        _initializeMediaCapture: function () {
            if (!this.attributes.recorderBlob) {
                this.attributes.recorderPreview = document.getElementById('preview');
                this.attributes.recorderPreview.muted = true;

                var self = this;

                navigator.getUserMedia({audio: true, video: true}, function (media) {
                    self.attributes.recorderPreview.src = window.URL.createObjectURL(media);
                    self.attributes.recorderPreview.play();

                    self._setRecorderBlob(media);
                }, function () {
                    console.log("[Production_controller.js > _initializeMediaCapture] ERROR : Failed to get the blob.");
                });
            } else {
                this.attributes.recorderPreview = document.getElementById('preview');
                this.attributes.recorderPreview.muted = true;
                this.attributes.recorderPreview.src = window.URL.createObjectURL(this.attributes.recorderBlob);
                this.attributes.recorderPreview.play();
            }
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
                if (key.video && key.audio) {
                    key.video.pause();
                    key.audio.pause();
                    key.video.currentTime = 0;
                    key.audio.currentTime = 0;
                }
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
                    // console.log("Link Audio : ", audioUrl);
                    options.audio = audioUrl;
                });
                this.attributes.recorder.video.stopRecording(function (videoUrl) {
                    // console.log("Link Video : ", videoUrl);
                    options.video = videoUrl;
                });

                this.attributes.recorder.isRecording = false;
            }

            return options;
        },

        remove: function (model) {
            this.views.recorder.collection.remove(model);
            delete this.attributes.selectedIds[model.cid];
        },

        addComments: function (str) {
            // On ajoute le nouveau commentaire aux anciens
            var newComment = new CommentModel({
                username: AppData.user.get('username'),
                comment: str
            });
            this.views.comments.collection.add(newComment);
        }
    });

    return RecorderController;

});
