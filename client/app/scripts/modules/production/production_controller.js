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
    var VideosListView = require('modules/production/views/jam_videos_list');

    var CommentModel = require('modules/production/models/comment');
    var CommentCollection = require('modules/production/collections/comments');
    var VideoModel = require('modules/common/models/video');
    var VideoCollection = require('modules/common/collections/videos');
    var Jam = require('modules/common/models/jam');

    var AppData = require('modules/common/app_data');

    var PlayerManager = require('modules/production/player_manager');

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
                vent.trigger('recorder:initMediaCapture');
                break;
            case 'create':
                BaseController.prototype.show.call(this);
                vent.trigger('recorder:initMediaCapture');
                break;
            }
        },

        getLayout: function () {
            var productionLayout = new ProductionLayout();

            this.listenTo(productionLayout, 'show', function () {
                this.views.recorder = new RecorderView();
                this.views.sidebar = new SideBarView();
                this.views.comments = new CommentsView();
                this.views.videos_list = new VideosListView();

                productionLayout.recorder.show(this.views.recorder);
                productionLayout.sidebar.show(this.views.sidebar);
                productionLayout.comments.show(this.views.comments);
                productionLayout.videos_list.show(this.views.videos_list);
            });

            return productionLayout;
        },

        _initializeAttributes: function () {
            this.views = {};
            this.attributes = {};
            this.attributes.models = {};

            _.extend(this.attributes, new PlayerManager());
        },

        _bindEvents: function () {
            this.listenTo(vent, 'recorder:save', this.save);

            this.listenTo(vent, 'player:remove', this.remove);

            this.listenTo(vent, 'comment:new', this.addComments);

            this.listenTo(vent, 'video:new', function (options) {
                this.addSelectedId(
                    this.addNewVideo({
                        video_blob: options.video_blob,
                        audio_blob: options.audio_blob
                    })
                );
            });
        },

        getJamFromServer: function () {
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
                    self.views.comments.collection.add(self.attributes.models.comments);
                }
            });
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
            options.description = 'Jackie Sharp';
            options.instrument = 3;
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

        remove: function (model) {
            this.views.recorder.collection.remove(model);
            delete this.attributes.selectedIds[model.cid];
        },

        addComments: function (str) {
            // On ajoute le nouveau commentaire aux anciens
            var self = this;

            var newComment = new CommentModel({
                username: AppData.user.get('name'),
                comment: str
            });
            newComment.save({}, {
                jamId: self.attributes.jamId,
                success: function (xhr) {
                    console.log('::success::', xhr);
                }
            });

            this.views.comments.collection.add(newComment);
        }
    });

    return RecorderController;

});
