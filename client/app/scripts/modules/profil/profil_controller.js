/*global define*/
define(function (require) {
    'use strict';

    var BaseController = require('modules/common/controllers/base_controller');

    var ProfilLayout = require('modules/profil/views/profil_layout');
    var ProfilView = require('modules/profil/views/profil_view');
    var User = require('modules/common/models/user');
    var Jam = require('modules/common/models/jam');
    var JamView = require('modules/common/views/jam_view');

    var ProfilController = BaseController.extend({
        initialize: function (options) {
            BaseController.prototype.initialize.call(this, options);

            this._initializeAttributes();
            this._bindEvents();

            if (options.user) {
                this.attributes.models.user = options.user;
            } else {
                this.attributes.models.user = new User({username: 'Coucou'});
            }
        },

        show: function () {
            BaseController.prototype.show.call(this);

            this.views.jamlist.collection.add(new Jam.JamModel({name: 'ba'}));
            this.views.jamlist.collection.add(new Jam.JamModel({name: 'dfgfdgfgd'}));
            this.views.jamlist.collection.add(new Jam.JamModel({name: 'bsad'}));
        },

        getLayout: function () {
            var profilLayout = new ProfilLayout();

            this.listenTo(profilLayout, 'show', function () {
                this.views.content = new ProfilView({model: this.attributes.models.user});
                this.views.jamlist = new JamView();

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
