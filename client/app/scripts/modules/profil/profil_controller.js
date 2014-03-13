/*global define*/
define(function (require) {
    'use strict';

    var BaseController = require('modules/common/controllers/base_controller');
    var vent = require('modules/common/vent');

    var ProfilLayout = require('modules/profil/views/profil_layout');
    var ProfilView = require('modules/profil/views/profil_view');
    var User = require('modules/common/models/user');
    var JamModel = require('modules/common/models/jam');

    var JamListView = require('modules/common/views/jams_view');
    var JamView = require('modules/profil/views/profil_jam_view');

    var AppData = require('modules/common/app_data');

    var ProfilController = BaseController.extend({
        initialize: function (options) {

            // Ici je recupere mes JAMS uniquement

            BaseController.prototype.initialize.call(this, options);

            this._initializeAttributes();
            this._bindEvents();

            this.listenTo(vent, 'user:fetching:end', function () {
                console.log('Profil jams', AppData.user.get('jams'));
                this.views.jamlist.collection.add(AppData.user.get('jams'));
            });
        },

        getAllJams: function () {
            this.views.jamlist.collection.add(AppData.user.get('jams'));
            console.log('[ProfilController > getAllJams]', AppData.user.get('jams'));
        },

        show: function () {
            BaseController.prototype.show.call(this);

            if (AppData.user) {
                this.views.jamlist.collection.add(AppData.user.get('jams'));
            }
        },

        getLayout: function () {
            var profilLayout = new ProfilLayout();

            this.listenTo(profilLayout, 'show', function () {
                this.views.content = new ProfilView({model: AppData.user});
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
            this.attributes.models = {};
            this.views = {};
        },

        _bindEvents: function () {

        }
    });

    return ProfilController;
});
