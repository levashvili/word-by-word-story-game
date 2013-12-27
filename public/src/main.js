require.config({
    //baseUrl:'../',
    paths: {
        jquery: '../lib/jquery/jquery-1.10.2',
        underscore: '../lib/underscore/underscore',
        backbone: '../lib/backbone/backbone',
        bootstrap: '../lib/bootstrap/js/bootstrap',
        text: '../lib/require/text'
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