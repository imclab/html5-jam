/*global define*/
define(function (require) {

    var User = require('modules/common/models/user');
    var vent = require('modules/common/vent');

    var App = {
        user: undefined,
        userId: -1,

        initUser: function (_id) {
            this.user = new User();
            this.userId = _id;
        },

        fetchUser: function () {
            this.user.fetch({
                url: 'api/users/' + this.userId,
                success: function () {
                    vent.trigger('user:fetching:end');
                },
                error: function () {
                    console.log("User don't exist in DDB");
                }
            });
        },

        isOwner: function (idParam) {
            return (this.user.get("id") === idParam);
        }

    };

    return App;
});
