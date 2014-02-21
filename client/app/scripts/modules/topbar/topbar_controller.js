/*global define*/
define(function (require) {
    "use strict";

    var Backbone = require('backbone');
    var Marionette = require('marionette');
    var vent = require('modules/common/vent');
    var TopBar = require('modules/topbar/views/topbar_view');
    var User = require('modules/common/models/user');


    var TopbarController = Marionette.Controller.extend({
        initialize: function (options) {
            this._initializeAttributes();
            this._bindEvents();

            if (options.user) {
                this.attributes.models.user = options.user;
            } else {
                this.attributes.models.user = new User({username: "Nobody"});
            }
        },

        _initializeAttributes: function () {
            this.attributes = {};
            this.attributes.models = {};
        },

        _bindEvents: function () {
            this.listenTo(vent, 'topbar:friends', this.toFriendList);
            this.listenTo(vent, 'topbar:profil', this.toProfil);
            this.listenTo(vent, 'topbar:newproject', this.toNewProject);

        },

        show: function () {
            this.getView().render();
        },

        getView: function () {
            return new TopBar({model: this.attributes.models.user});
        },

        toFriendList: function () {
            this.navigate('friends/');
        },

        toProfil: function () {
            this.navigate('profil/' + this.attributes.models.user.cid);
        },

        toNewProject: function () {
            this.navigate('jam/');
        },

        navigate: function (destination) {
            Backbone.history.navigate(destination, true);
        }

    });

    return TopbarController;
});
