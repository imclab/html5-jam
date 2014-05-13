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

    var LikeManager = require('modules/common/like_manager');

    var RecorderController = BaseController.extend({

        initialize: function (options) {
            BaseController.prototype.initialize.call(this, options);

            this._initializeAttributes(options);
            this._bindEvents();
        },

        show: function (options) {
            this.attributes.mode = options.mode;
            if (options.jamId) {
                this.attributes.jamId = options.jamId;
            } else {
                delete this.attributes.jamId;
                this.attributes.models = {};
            }

            BaseController.prototype.show.call(this);

            if (this.attributes.mode !== 'create') {
                this.getJamFromServer().then(function () {
                    vent.trigger('recorder:initMediaCapture');
                }, function () {
                    console.log("Error fetching JAM : JAM NOT FOUND");
                    Backbone.history.navigate('/', true);
                });
            } else {
                vent.trigger('recorder:initMediaCapture');
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

            _.extend(this.attributes, options.playerManager);

            this.attributes.mode = options.mode || "show";
        },

        _bindEvents: function () {
            this.listenTo(vent, 'recorder:save', function () {
                var _this = this;
                this.save().then(function () {
                    vent.trigger("recorder:empty");
                });
            });

            this.listenTo(vent, 'comment:new', this.addComments);
            this.listenTo(vent, 'comment:remove', this.removeComment);

            this.listenTo(vent, 'video:new', function (options) {
                this.addNewVideo(options);
            });

            this.listenTo(vent, 'jam:create', this.createNewJam);
            this.listenTo(vent, 'jam:like', this.likeJam);
            this.listenTo(vent, 'jam:dislike', this.dislikeJam);

            this.listenTo(vent, 'player:unactive', this.unactiveVideo);
            this.listenTo(vent, 'player:active', this.activeVideo);
        },

        getJamFromServer: function () {
            var self = this;

            this.attributes.models.jam = new Jam();
            this.attributes.models.videos = new VideoCollection();
            this.attributes.models.comments = new CommentCollection();

            this.views.recorder.model = this.attributes.models.jam;

            this.attributes.models.comments.fetch({ url: '/api/jams/' + self.attributes.jamId + '/comments' })
                .then(function (response) {
                    self.views.comments.collection.add(response.comments);
                });

            return this.attributes.models.jam.fetch({ url: '/api/jams/' + self.attributes.jamId })
                .then(function (response) {
                    // console.log("[ProductionController > JAM:" + self.attributes.jamId + "] Fetching from server : jam.cid=" + self.attributes.models.jam.cid);
                    _.each(response.videos, function (video) {
                        console.log("Video : ", _.clone(video));
                        video.jamId = self.attributes.jamId;
                        if (video.active > 0) {
                            // Add to videos list
                            self.views.recorder.collection.add(video);
                        } else {
                            // Add to SideBar
                            self.views.sidebar.collection.add(video);
                        }
                    });

                    self.views.recorder.render();
                });
        },

        _initializeSidebar: function () {
            this.views.sidebar.collection = this.attributes.models.videos;
        },

        save: function () {
            if (!this.attributes.models.jam) {
                return this.createNewJam();
            } else {
                return this.saveVideos().then(function () {
                    Backbone.history.loadUrl();
                });
            }
        },

        saveVideos: function () {
            return this.views.recorder.collection.save({jamId: this.attributes.jamId});
        },

        addNewVideo: function (options) {
            options.instrument = 5;
            options.active = 0;
            options.volume = 10;

            var newModel = new VideoModel(options);
            this.views.recorder.collection.add(newModel);
            return newModel;
        },

        addComments: function (str) {
            if (this.attributes.jamId === null) {
                console.log("Save the jam before adding comments !");
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
            var _name = this.views.recorder.ui.edit_jam_name.val();

            if (_name==="") {
                console.log("Enter a name to your Jam");
                return new $.Deferred().fail();
            }

            return new Jam({
                user_facebook_id: AppData.user.get('facebook_id'),
                name: _name
            })
                .save(null, {})
                .then(function (model) {
                    _this.attributes.jamId = model.id;
                    return _this.saveVideos();
                })
                .then(function () {
                    Backbone.history.navigate('jam/' + _this.attributes.jamId, true);
                });
        },

        unactiveVideo: function (model) {
            this.views.sidebar.collection.add(model);
            this.views.recorder.collection.remove(model);

        },

        activeVideo: function (model) {
            this.views.recorder.collection.add(model);
            this.views.sidebar.collection.remove(model);

            // this.views.sidebar.render();
            // this.views.recorder.render();
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
        }

    });

    _.extend(RecorderController.prototype, LikeManager);

    return RecorderController;

});
