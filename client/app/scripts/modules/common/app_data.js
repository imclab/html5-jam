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
                success: function (xhr) {
                    vent.trigger('user:fetching:end');
                    console.log("DAUBE : ", xhr);
                },
                error: function () {
                    // L'utilisateur n'existe pas dans la BDD
                    // Besoin de creer un profil
                }
            });
        }
    };

    return App;
});
