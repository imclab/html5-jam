/*global define*/
/*global window*/
define(function (require) {
    "use strict";

    var _ = require('underscore');
    var Backbone = require('backbone');
    var Marionette = require('marionette');
    var AppController = require('controller');

    var App = new Backbone.Marionette.Application();

    var AppRouter = Marionette.AppRouter.extend({

        appRoutes: {
            'jam/(:jamId)'       : 'showJam',
            'profil/(:profilId)' : 'showProfil',
            'friends/'           : 'showFriends',
            'login/'             : 'showLogin',
            ':tokenId'           : 'handleToken',
            ''                   : 'showIndex'
        }

    });

    // Define the regions
    App.addRegions({
        // topbar: '#topbar',
        corpus: '#corpus'
    });

    App.addInitializer(function () {
        this.root = '/';
    });

    // Override Marionette's route to fetch templates from the JST object
    App.addInitializer(function () {
        window.JST = window.JST || {};
        var JST = window.JST;

        Marionette.Renderer.render = function (template, data) {
            template = "templates/" + template + ".html";
            if (!JST["app/" + template]) {
                $.ajax({ url: "/" + template, async: false }).then(function (contents) {
                    JST["app/" + template] = _.template(contents);
                });
            }
            // if (!JST[template]) throw "Template '" + template + "' not found!";
            return JST["app/" + template](data);
        };
    });

    App.addInitializer(function () {
        new AppRouter({
            controller: new AppController({
                regions: {
                    // topbar: App.topbar,
                    corpus: App.corpus
                }
            })
        });
    });

    // Return the instantiated app (there should only be one)
    return App;

});
