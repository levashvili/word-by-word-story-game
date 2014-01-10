require.config({
    baseUrl:'../src/',
    urlArgs: 'cb=' + Math.random(),
    paths: {
        jquery: '../lib/jquery/jquery-1.10.2',
        underscore: '../lib/underscore/underscore',
        backbone: '../lib/backbone/backbone',
        localStorage: '../lib/backbone/backbone.localStorage',
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
        },
        localStorage: {
            deps: ["backbone"],
            exports: "localStorage"
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
    'localStorage',
    'socket_io',
    'views/master-view',
    'collections/players',
    'models/story'
], function($, Backbone, LocalStorage, SocketIO, MasterView, PlayerCollection, Story) {

    var Router = Backbone.Router.extend({
        routes: {
            "": "main"
        },

        main: function(){
            var sessionId = ''
            //var tasks = new Todo.Collection();
            var socket = SocketIO.connect();
            //create players collection
            var players = new PlayerCollection();
            players.add([{
                name: 'Siri',
                age: 12,
                gender: 'female'
            }, {
                name: 'Samuel',
                age: 23,
                gender: 'male'
            }, {
                name: 'Stephanie',
                age: 21,
                gender: 'female'
            }]);

            var story = new Story({
                title: "A Series of Unfortunate Events",
                paragraphs: ['First paragraph. First paragraph. First paragraph. First paragraph. First paragraph. First paragraph. First paragraph. First paragraph. First paragraph. First paragraph. ',
                    'Second paragraph. Second paragraph. Second paragraph. Second paragraph. Second paragraph. Second paragraph. Second paragraph. Second paragraph. ',
                    'Third paragraph. Third paragraph. Third paragraph. Third paragraph. Third paragraph. Third paragraph. Third paragraph. '
                ],
                unEditableText: "Some text. Some text. Some text. Some text. Some text. Some text. Some text. Some text. Some text. <br>Some text. Some text. Some text. Some text. Some text. Some text. Some text. Some text. Some text. Some text. <br> Some text. Some text. Some text. Some text. Some text. Some text. Some text. <br>",
                editableText: "This is editable text right here."
            });

            socket.on('connect', function() {
                sessionId = socket.socket.sessionid
            });
            var view = new MasterView({
                playerCollection: players,
                story: story
            });
            $("#container").html(view.render().el).show();
//            players.fetch({
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
