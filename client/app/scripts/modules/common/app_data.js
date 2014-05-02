/*global define*/
define(function (require) {

    var User = require('modules/common/models/user');

    var App = {
        user: undefined,
        userId: -1,
        mediaStream: undefined,

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
        },

        createFakeUser: function () {
            this.user = new User({
                facebook_id: '12345678910',
                email: 'jesuisunfake@gmail.com',
                jams: [],
                name: 'Jesuis Unfake',
                picture_url: '',
                id: 1337,
                vignette_one: null,
                vignette_three: null,
                vignette_two: null,
                createdAt: '2014-02-19 00:00:00',
                doIFollowHim: false
            });
        }

    };

    return App;
});
