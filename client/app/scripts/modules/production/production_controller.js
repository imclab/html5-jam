/*global define*/
define(function (require) {
    "use strict";

    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseController = require('modules/common/controllers/base_controller');
    var vent = require('modules/common/vent');

    var ProductionLayout = require('modules/production/views/production_layout');
    var RecorderView = require('modules/production/views/recorder_view');
    var SideBarView = require('modules/production/views/sidebar_view');
    var CommentsView = require('modules/production/views/comments_view');

    var CommentModel = require('modules/production/models/comment');
    var CommentCollection = require('modules/production/collections/comments');
    var VideoModel = require('modules/common/models/video');
    var VideoCollection = require('modules/common/collections/videos');
    var Jam = require('modules/common/models/jam');

    var AppData = require('modules/common/app_data');

    var PlayerManager = require('modules/production/player_manager');
    var LikeManager = require('modules/common/like_manager');
    var KeyboardManager = require('modules/common/keyboard_manager');

    var RecorderController = BaseController.extend({

        initialize: function (options) {
            BaseController.prototype.initialize.call(this, options);

            this._initializeAttributes(options);
            this._initializeControls();
            this._bindEvents();

            console.log('[ProductionController > onInit] ', options);
        },

        show: function (options) {
            if (options.jamId) {
                this.attributes.jamId = options.jamId;
            } else {
                delete this.attributes.jamId;
                this.attributes.models = {};
            }

            this.attributes.mode = options.mode;

            switch (this.attributes.mode) {
            case 'edit':
                this.getJamFromServer();
                BaseController.prototype.show.call(this);
                break;
            case 'show':
                this.getJamFromServer();
                BaseController.prototype.show.call(this);
                break;
            case 'create':
                BaseController.prototype.show.call(this);
                vent.trigger('recorder:initMediaCapture');
                break;
            }
        },

        getLayout: function () {
            var productionLayout = new ProductionLayout({
                mode: this.attributes.mode
            });

            this.listenTo(productionLayout, 'show', function () {
                this.views.recorder = new RecorderView({
                    mode: this.attributes.mode
                });

                if (this.attributes.mode !== "create") {
                    this.views.sidebar = new SideBarView();
                    this.views.comments = new CommentsView();

                    productionLayout.sidebar.show(this.views.sidebar);
                    productionLayout.comments.show(this.views.comments);
                }

                productionLayout.recorder.show(this.views.recorder);
            });

            return productionLayout;
        },

        _initializeAttributes: function (options) {
            this.views = {};
            this.attributes = {};
            this.attributes.models = {};

            _.extend(this.attributes, new PlayerManager());

            this.attributes.mode = options.mode || "show";
        },

        _bindEvents: function () {
            this.listenTo(vent, 'recorder:save', this.save);

            this.listenTo(vent, 'player:remove', this.removeVideo);

            this.listenTo(vent, 'comment:new', this.addComments);
            this.listenTo(vent, 'comment:remove', this.removeComment);

            this.listenTo(vent, 'video:new', function (options) {
                this.addSelectedId(
                    this.addNewVideo(options)
                );
            });

            this.listenTo(vent, 'jam:create', this.createNewJam);
            this.listenTo(vent, 'jam:like', this.likeJam);
            this.listenTo(vent, 'jam:dislike', this.dislikeJam);
        },

        getJamFromServer: function () {
            var self = this;

            this.attributes.models.jam = new Jam();
            this.attributes.models.videos = new VideoCollection();
            this.attributes.models.comments = new CommentCollection();

            // ACTIVE OU NON PLZ
            this.attributes.models.jam.fetch({
                url: '/api/jams/' + self.attributes.jamId,
                success: function (model, response) {
                    console.log("[ProductionController > JAM:" + self.attributes.jamId + "] Fetching from server : jam.cid=" + self.attributes.models.jam.cid);

                    var i;
                    for (i = 0; i < response.videos.length; i++) {
                        response.videos[i].jamId = self.attributes.jamId;

                        if (response.videos[i].active) {
                            // Add to videos list
                            self.views.recorder.collection.add(response.videos[i]);
                        } else {
                            // Add to SideBar
                            self.views.sidebar.collection.add(response.videos[i]);
                        }
                    }

                    self.views.recorder.model = model;
                    self.views.recorder.model.set("fetch", "true");
                    self.views.recorder.render();
                }
            });

            this.attributes.models.comments.fetch({
                url: '/api/jams/' + self.attributes.jamId + '/comments',
                success: function (model, response) {
                    console.log('[ProductionController > Comments]', response);
                    self.views.comments.collection.add(response.comments);
                }
            });
        },

        _initializeSidebar: function () {
            this.views.sidebar.collection = this.attributes.models.videos;
        },

        save: function () {
            if (!this.attributes.models.jam) {
                console.log("[Production_controller.js > save] STATUS : No Jam loaded : ", this.views.recorder.collection);
                this.createNewJam();
            } else {
                // Actualise / create the jam
                // Save the video
                // Add the video to the jam
                // Reload the page
                console.log("[Production_controller.js > save] STATUS : ", this.attributes.selectedIds);
                this.saveVideos().then(function () {
                    Backbone.history.loadUrl();
                });
            }
        },

        saveVideos: function () {
            return this.views.recorder.collection.save({
                jamId: this.attributes.jamId
            });
        },

        addNewVideo: function (options) {
            console.log("NewVideo options : ", options);

            options.instrument = 5;
            options.active = true;
            options.volume = 10;

            var newModel = new VideoModel(options);
            this.views.recorder.collection.add(newModel);
            return newModel;
        },

        addSelectedId:  function (model) {
            this.attributes.selectedIds[model.cid] = {};
            this.attributes.selectedIds[model.cid].video = document.getElementById("video-player-" + model.get('_cid'));
            this.attributes.selectedIds[model.cid].audio = document.getElementById("audio-player-" + model.get('_cid'));
        },

        removeVideo: function (model) {
            model.destroy({
                jamId: this.attributes.jamId
            });
            this.views.recorder.collection.remove(model);
            delete this.attributes.selectedIds[model.cid];
        },

        addComments: function (str) {
            if (this.attributes.jamId === null) {
                alert("Save the jam before adding comments !");
                return;
            } else if (str === null || str.length === 0) {
                return;
            }

            var self = this;

            var newComment = new CommentModel({
                userId: AppData.user.get('id'),
                ownerName: AppData.user.get('name'),
                ownerFacebookId: AppData.user.get('facebook_id'),
                content: str
            });

            newComment.save({}, {
                jamId: self.attributes.jamId
            });

            this.views.comments.collection.add(newComment);
            this.views.comments.ui.textarea.val('');
        },

        removeComment: function (model) {
            model.destroy({
                jamId: this.attributes.jamId
            });
            this.views.comments.collection.remove(model);
        },

        createNewJam: function () {
            var _this = this;

            new Jam({
                user_facebook_id: AppData.user.get('facebook_id'),
                name: this.views.recorder.ui.edit_jam_name.val()
            })
            .save(null, {})
            .then(function (model) {
                _this.attributes.jamId = model.id;
                return _this.saveVideos();
            })
            .then(function () {
                console.log("Arguments : ", arguments);
                Backbone.history.navigate('jam/' + _this.attributes.jamId, true);
            });
        },

        onClose: function () {
            this.closeManager();
            BaseController.prototype.onClose.call(this);
        },

        closeManager: function () {
            if (this.attributes.recorder.isRecording) {
                this.attributes.recorder.audio.stopRecording();
                this.attributes.recorder.video.stopRecording();
            }

            delete this.attributes.recorder;
            delete this.attributes.recorderPreview;
            delete this.attributes.recorderBlob;
            delete this.attributes.selectedIds;
        },

        _initializeControls: function () {
            this.initKeyboardManager();
        }

    });

    _.extend(RecorderController.prototype, LikeManager);
    _.extend(RecorderController.prototype, KeyboardManager);

    return RecorderController;

});
