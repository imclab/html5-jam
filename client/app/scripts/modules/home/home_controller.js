/*global define*/
define(function (require) {
    'use strict';

    var BaseController = require('modules/common/controllers/base_controller');
    var vent = require('modules/common/vent');

    var JamCollection = require('modules/common/collections/jams');
    var JamListView = require('modules/common/views/jams_view');
    var JamView = require('modules/common/views/jam_view');

    var FeedsLayout = require('modules/home/views/feeds_layout');

    var LikeManager = require('modules/common/like_manager');

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
            this.listenTo(vent, 'feeds:showSelection', this.showFeeds);
        },

        showFeeds: function (feedsType) {
            var self = this;

            // Couille ici, spa narmol
            this.attributes.models.feeds.fetch({
                url: '/api/feeds/',
                data: { feedsType: feedsType },
                success: function (xhr) {
                    self.views.feeds.collection = new JamCollection();
                    self.views.feeds.collection.add(xhr.models[0].get('jams'));
                    self.views.feeds.render();

                    console.log("XHR", xhr);
                }
            });
        }

    });

    _.extend(HomeController.prototype, LikeManager);

    return HomeController;
});
