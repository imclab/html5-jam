define([
    "underscore",
    "backbone",
    "marionette",
    "fastclick",
    "controller"
],

function (_, Backbone, Marionette, FastClick, AppController) {

    var App = new Backbone.Marionette.Application();

    var AppRouter = Marionette.AppRouter.extend({

        appRoutes: {
            ''                  : 'showIndex',
            '/jam/:jamId'       : 'showJam',
            '/profil/:profilId' : 'showProfil'
        }

    });

    // Define the regions
    App.addRegions({
        topbar: '#topbar',
        production: '#production'
    });

    // FastClick
    App.addInitializer(function () {
        FastClick.attach(document.body);
    });

    App.addInitializer(function () {
        this.root = '/';
    });

    // Override Marionette's route to fetch templates from the JST object
    App.addInitializer(function () {
        var JST = window.JST = window.JST || {};
        console.log('[JST] init');

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
                    production: App.production,
                    topbar: App.topbar
                }
            })
        });

    });

    // Return the instantiated app (there should only be one)
    return App;

});
