require.config({
    //baseUrl:'../',
    paths: {
        jquery: 'jquery',
        underscore: 'underscore',
        backbone: 'backbone-min'
        //bootstrap: 'vendor/bootstrap/js/bootstrap.min',
        //text: 'vendor/require/text'
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
require(['app'], function(AppView){
    var app_view = new AppView;
    app_view.render();
});