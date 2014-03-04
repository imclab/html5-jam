/*global define*/
define(function (require) {
    'use strict';

    var BaseController = require('modules/common/controllers/base_controller');
    var vent = require('modules/common/vent');

    var User = require('modules/common/models/user');
    var FriendlistLayout = require('modules/friendlist/views/friendlist_layout');
    var FriendlistView = require('modules/friendlist/views/friendlist_view');
    var SideBarView = require('modules/friendlist/views/sidebar_view');

    var Stamp = require('modules/friendlist/models/stamp');

    var FriendlistController = BaseController.extend({

        initialize: function (options) {
            BaseController.prototype.initialize.call(this, options);

            this._initializeAttributes();
            this._bindEvents();
        },

        show: function () {
            BaseController.prototype.show.call(this);

            this._getAllStamps();
        },

        getLayout: function () {
            var friendlistLayout = new FriendlistLayout();

            this.listenTo(friendlistLayout, 'show', function () {
                this.views.stamplist = new FriendlistView();
                this.views.sidebar = new SideBarView();
                // this.views.sidebar = new SideBarView();

                friendlistLayout.stamplist.show(this.views.stamplist);
                friendlistLayout.sidebar.show(this.views.sidebar);
            });

            return friendlistLayout;
        },

        _initializeAttributes: function () {
            this.attributes = {};
            this.views = {};
        },

        _bindEvents: function () {

        },

        _getAllStamps: function () {
            this.attributes.stamps = new Stamp.StampCollection();

            this.views.stamplist.collection.add([
                new Stamp.StampModel({username: 'Bobby'}),
                new Stamp.StampModel({username: 'Tamer'}),
                new Stamp.StampModel({username: 'Piano'}),
                new Stamp.StampModel({username: 'Plume'}),
                new Stamp.StampModel({username: 'Marion'}),
                new Stamp.StampModel({username: 'Guitare'}),
                new Stamp.StampModel({username: 'Flute'}),
                new Stamp.StampModel({username: 'Beurk'})
            ]);
        }
    });

    return FriendlistController;

});
