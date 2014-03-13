/*global define*/
define(function (require) {
    'use strict';

    var BaseController = require('modules/common/controllers/base_controller');
    var vent = require('modules/common/vent');

    var User = require('modules/common/models/user');
    var JamCollection = require('modules/common/collections/jams');
    var JamListView = require('modules/common/views/jams_view');
    var JamView = require('modules/common/views/jam_view');

    var MenuView = require('modules/home/views/menu_view');
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

            var self = this;

            this.attributes.models.feeds.fetch({
                url: '/api/feeds',
                success: function (xhr) {
                    self.views.feeds.collection.add(xhr.models[0].get('jams'));
                }
            });
        },

        getLayout: function () {
            var profilLayout = new FeedsLayout();

            this.listenTo(profilLayout, 'show', function () {
                this.views.menu = new MenuView({model: AppData.user});
                this.views.feeds = new JamListView({
                    view: JamView
                });

                profilLayout.feeds.show(this.views.feeds);
                profilLayout.menu.show(this.views.menu);
            });

            return profilLayout;
        },

        _initializeAttributes: function () {
            this.attributes = {};
            this.attributes.models = {};
            this.views = {};
        },

        _bindEvents: function () {

        }
    });

    return HomeController;
});
