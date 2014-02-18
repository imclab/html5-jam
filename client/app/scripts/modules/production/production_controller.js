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

    var Comment = require('modules/production/models/comment');
    var Video = require('modules/common/models/video');
    var User = require('modules/common/models/user');
    var Jam = require('modules/common/models/jam');

    var RecorderController = BaseController.extend({

        initialize: function (options) {
            BaseController.prototype.initialize.call(this, options);

            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.getUserMedia;

            this._initializeAttributes();
            this._bindEvents();

            if (options.jam_id) {
                // Existing project :
                this.fetch(options.jam_id);

                console.log("[JAM:" + options.jam_id + "] Fetching from server : jam.cid=" + this.attributes.models.jam.cid);
            }

            if (options.user) {
                this.attributes.models.user = options.user;
            }



            // var test = new Jam.JamModel({name: 'coucouJam231'});
            // test.url = '/api';
            // test.fetch();

            // console.log(test);
        },

        show: function () {
            BaseController.prototype.show.call(this);
            this._initializeMediaCapture();
        },

        getLayout: function () {
            var productionLayout = new ProductionLayout();

            this.listenTo(productionLayout, 'show', function () {
                this.views.recorder = new RecorderView();
                this.views.sidebar = new SideBarView();
                this.views.comments = new CommentsView();
                this.views.selected_list = new SelectedListView();

                productionLayout.recorder.show(this.views.recorder);
                productionLayout.sidebar.show(this.views.sidebar);
                productionLayout.comments.show(this.views.comments);
                productionLayout.selected_list.show(this.views.selected_list);
            });

            return productionLayout;
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
            this.attributes.models = {};

            this.views = {};
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

        fetch: function (jam_id) {
            // If it's not a new project
            // Need to :
            //          get the jam from the server with the jam_id
            //          get all the video from the jam
            //          get all the comments

            this.attributes.models.jam = new Jam.JamModel({
                id: jam_id
            });
            // this.attributes.models.jam.fetch({url: '/jam/'+jam_id});
            // this.attributes.models.jam.fetch();

            this.attributes.models.videos = new Video.VideoCollection({

            });
            // this.attributes.models.videos.fetch();
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
            }

            // On reinitialise tout => refetch du jam et pas besoin de passer un objet d'une vue a l'autre
        },

        addNewVideo: function (options) {
            var newModel = new Video.VideoModel(options);
            this.views.recorder.collection.add(newModel);
            return newModel;
        },

        addSelectedId:  function (model) {
            this.attributes.selectedIds[model.cid] = {};
            this.attributes.selectedIds[model.cid].video = document.getElementById("video-player-" + model.get('_cid'));
            this.attributes.selectedIds[model.cid].audio = document.getElementById("audio-player-" + model.get('_cid'));
        },

        _initializeMediaCapture: function () {
            var preview = document.getElementById('preview');
            preview.muted = true;

            var self = this;

            navigator.getUserMedia({audio: true, video: true}, function (media) {
                preview.src = window.URL.createObjectURL(media);
                preview.play();

                self._setRecorderBlob(media);
            }, function () {
                console.log("[Production_controller.js > _initializeMediaCapture] ERROR : Failed to get the blob.");
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
            var newComment = new Comment.CommentModel({
                username: this.attributes.models.user.get('username'),
                comment: str
            });
            this.views.comments.collection.add(newComment);
        }

    });

    return RecorderController;

});
