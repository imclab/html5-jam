/*global define*/
define(function (require) {
    'use strict';

    var BaseController = require('modules/common/controllers/base_controller');
    var vent = require('modules/common/vent');

    var ProfilLayout = require('modules/profil/views/profil_layout');
    var ProfilView = require('modules/profil/views/profil_view');
    var User = require('modules/common/models/user');
    var Friend = require('modules/common/models/friend');

    var JamListView = require('modules/common/views/jams_view');
    var JamView = require('modules/profil/views/profil_jam_view');

    var AppData = require('modules/common/app_data');

    var ProfilController = BaseController.extend({
        initialize: function (options) {
            BaseController.prototype.initialize.call(this, options);

            this._initializeAttributes();
            this._bindEvents();
        },

        getAllJams: function () {
            this.views.jamlist.collection.add(AppData.user.get('jams'));
            console.log('[ProfilController > getAllJams]', AppData.user.get('jams'));
        },

        show: function (options) {
            BaseController.prototype.show.call(this);

            var _this = this;

            if (!options.profilId || AppData.isOwner(options.profilId)) {
                this.views.content.model = AppData.user;
                this.views.content.render();
                this.views.jamlist.collection.add(AppData.user.get('jams'));
            } else {
                this.views.content.model = new User();
                this.views.content.model.fetch({
                    url: 'api/users/' + options.profilId
                }).then(function (response) {
                    _this.views.content.render();
                    _this.views.jamlist.collection.add(response.jams);
                });
            }
        },

        getLayout: function () {
            var profilLayout = new ProfilLayout();

            this.listenTo(profilLayout, 'show', function () {
                this.views.content = new ProfilView();
                this.views.jamlist = new JamListView({
                    view: JamView
                });

                profilLayout.content.show(this.views.content);
                profilLayout.jamlist.show(this.views.jamlist);
            });

            return profilLayout;
        },

        _initializeAttributes: function () {
            this.attributes = {};
            this.views = {};
        },

        _bindEvents: function () {
            this.listenTo(vent, 'user:follow', this.followUser);
            this.listenTo(vent, 'user:unfollow', this.unfollowUser);
        },

        followUser: function (friendId) {
            new Friend({
                friendId: friendId
            }).save({}, {
                success: function (xhr) {
                    console.log('::success::', xhr);
                }
            });
        },

        unfollowUser: function (friendId) {
            new Friend({
                id: '',
                friendId: friendId
            }).destroy({
                success: function (xhr) {
                    console.log('::success::', xhr);
                }
            });
        }

    });

    return ProfilController;
});
