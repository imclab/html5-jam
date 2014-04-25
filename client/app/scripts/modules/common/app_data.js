/*global define*/
define(function (require) {

    var User = require('modules/common/models/user');

    var App = {
        user: undefined,
        userId: -1,

        fetchUser: function (options) {
            options = options || {};

            if (options.userId) {
                this.user = new User();
                this.userId = options.userId;
            }

            return this.user.fetch({ url: 'api/users/' + this.userId });
        },

        isOwner: function (idParam) {
            if (typeof idParam !== "number") {
                idParam = parseInt(idParam);
            }

            return (this.user.get("id") === idParam);
        }

    };

    return App;
});
