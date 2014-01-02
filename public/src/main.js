require.config({
    baseUrl:'../src/',
    urlArgs: 'cb=' + Math.random(),
    paths: {
        jquery: '../lib/jquery/jquery-1.10.2',
        underscore: '../lib/underscore/underscore',
        backbone: '../lib/backbone/backbone',
        bootstrap: '../lib/bootstrap/js/bootstrap',
        text: '../lib/require/text',
        socket_io: '../lib/socket.io/socket.io'
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
//require(['views/app', 'views/game-room', 'views/text-area', 'views/text-area/story-text-area'],
//    function(AppView, GameRoomView, TextAreaView, StoryTextAreaView){
//    //var app_view = new AppView();
//    //app_view.render();
//    //var game_room_view = new GameRoomView();
//    //game_room_view.render();
//        var customEvents = _.extend({}, Backbone.Events);
//        var text_area_view = new StoryTextAreaView({
//            parentEl: $('#text-area'),
//            customEvents: customEvents
//        });
//
//        text_area_view.render();
//});
require([
    'jquery',
    'backbone',
    'socket_io',
    'views/master-view'
], function($, Backbone, SocketIO, MasterView ) {

    var Router = Backbone.Router.extend({
        routes: {
            "": "main"
        },

        main: function(){
            //var serverBaseUrl = document.domain;http://leena-levashvili.com/
            var serverBaseUrl = "http://leena-levashvili.com/"
            var sessionId = ''
            //var tasks = new Todo.Collection();
            var socket = SocketIO.connect();
            socket.on('connect', function() {
                sessionId = socket.socket.sessionid
            });
//            var view = new MasterView({collection: tasks});
//            tasks.fetch({
//                success: function(tasks){
//                    $("#container").html(view.render().el).show();
//                },
//                error: function(model, error) {
//                    // TODO: handle errors nicer
//                    alert(error);
//                }
//            });
        }
    });

    // Preload CSS Sprite
    //$('<img/>').attr('src', "./css/glyphicons.png");

    var router = new Router();
    Backbone.history.start();

});
