require.config({
    //baseUrl:'../',
    paths: {
        jquery: 'lib/jquery',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone-min',
        bootstrap: 'lib/bootstrap/js/bootstrap',
        text: 'lib/text'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        }
    }
});
require(['views/app'], function(AppView){
    var app_view = new AppView;
    app_view.render();
});