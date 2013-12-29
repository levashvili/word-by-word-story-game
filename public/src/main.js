require.config({
    baseUrl:'../src/',
    urlArgs: 'cb=' + Math.random(),
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
require(['views/app', 'views/game-room', 'views/text-area'], function(AppView, GameRoomView, TextAreaView){
    //var app_view = new AppView();
    //app_view.render();
    //var game_room_view = new GameRoomView();
    //game_room_view.render();
    var text_area_view = new TextAreaView({el: $('#text-area')});
    text_area_view.render();
});