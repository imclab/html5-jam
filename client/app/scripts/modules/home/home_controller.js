/*global define*/
define(function (require) {
    'use strict';

    var BaseController = require('modules/common/controllers/base_controller');
    var vent = require('modules/common/vent');

    var User = require('modules/common/models/user');
    var Like = require('modules/common/models/like');
    
    var JamCollection = require('modules/common/collections/jams');
    var JamListView = require('modules/common/views/jams_view');
    var JamView = require('modules/common/views/jam_view');

    var FeedsLayout = require('modules/home/views/feeds_layout');

    var AppData = require('modules/common/app_data');

    var HomeController = BaseController.extend({
        initialize: function (options) {
            BaseController.prototype.initialize.call(this, options);

            this._initializeAttributes();
            this._bindEvents();

            this.attributes.models.feeds = new JamCollection();
        },

        show: function () {
            BaseController.prototype.show.call(this);
            this.showFeeds('popular');
        },

        getLayout: function () {
            var profilLayout = new FeedsLayout();

            this.listenTo(profilLayout, 'show', function () {
                this.views.feeds = new JamListView({
                    view: JamView
                });
                profilLayout.feeds.show(this.views.feeds);
            });

            return profilLayout;
        },

        _initializeAttributes: function () {
            this.attributes = {};
            this.attributes.models = {};
            this.views = {};
        },

        _bindEvents: function () {
            this.listenTo(vent, 'jam:like', this.likeJam);
            this.listenTo(vent, 'jam:dislike', this.dislikeJam);

            this.listenTo(vent, 'feeds:showMostPopular', this.showFeeds);
            this.listenTo(vent, 'feeds:showMostRecent', this.showFeeds);
            this.listenTo(vent, 'feeds:showFriendsJams', this.showFeeds);
            this.listenTo(vent, 'feeds:showOurFavorites', this.showFeeds);

        },

        likeJam: function (jamId) {
            new Like({
                jamId: jamId
            }).save({
                success: function (xhr) {
                    console.log('::success::', xhr);
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
                }
            });
        },

        showFeeds: function (feedsType) {
            var self = this;

            this.attributes.models.feeds.fetch({
                url: '/api/feeds/',
                data: { type: feedsType },
                success: function (xhr) {
                    self.attributes.models.feeds = new JamCollection(); 
                    self.views.feeds.collection.add(xhr.models[0].get('jams'));
                }
            });
        }

    });

    return HomeController;
});
