/*global define*/
define(function (require) {

    var User = require('modules/common/models/user');
    var vent = require('modules/common/vent');

    var App = {
        user: undefined,
        userId: -1,

        initUser: function (id) {
            this.user = new User();
            this.userId = id;
        },

        fetchUser: function () {
            var promise = new Promise(_.bind(function (resolve, reject) {
                this.user.fetch({
                    url: 'api/users/' + this.userId,
                    success: function () {
                        vent.trigger('user:fetching:end');
                        resolve();
                    },
                    error: function () {
                        console.log("User don't exist in DDB");
                        reject();
                    }
                });
            }, this));

            return promise;
        },

        isOwner: function (idParam) {
            return (this.user.get("id") === idParam);
        }

    };

    return App;
});
