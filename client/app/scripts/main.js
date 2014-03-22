require([
    "jquery",
    "backbone",
    "app",
    "marionette",
    "templates"
],

function ($, Backbone, App) {

    App.start();

    // Trigger the initial route and enable HTML5 History API support
    Backbone.history.start(); // { pushState: true, root: App.root });

    // All navigation that is relative should be passed through the navigate
    // method, to be processed by the router. If the link has a `data-bypass`
    // attribute, bypass the delegation completely.
    $(document).on("click", "a:not([data-bypass])", function (e) {
        // Get the absolute anchor href.
        var href = {
                prop: $(this).prop("href"),
                attr: $(this).attr("href")
            },
            root = location.protocol + "//" + location.host + App.root;

        // Ensure the root is part of the anchor href, meaning it's relative.
        if (href.prop && href.prop.slice(0, root.length) === root) {
            e.preventDefault();
            Backbone.history.navigate(href.attr, true);
        }
    });

    $(document).on("click", "a[data-bypass]", function (e) {
        e.preventDefault();
    });

    /**
     * Home Pop-ups
     */
    $(document).on("click", "span[modal]", function (e) {
        $(this.getAttribute('modal')).addClass('show');
    });
    $(document).on("click", "[closeModal]:not(.modalDialog div)", function (e) {
        $(this.getAttribute('closeModal')).removeClass('show');
    });
    $(document).on("click", "[closeModal] div", function (e) {
        e.stopPropagation();
    });

    $(document).on("click", "#linkInstructions", function (e) {
        var top = window.pageYOffset || document.documentElement.scrollTop
        if (top < document.body.scrollHeight / 3) {
            $("html, body").animate({ scrollTop: document.body.scrollHeight }, 500);
        } else {
            $("html, body").animate({ scrollTop: 0 }, 500);
        }
    });
});
