require.config({
    baseUrl:'../src/',
    urlArgs: 'cb=' + Math.random(),
    paths: {
        jquery: '../lib/jquery/jquery-1.10.2',
        underscore: '../lib/underscore/underscore',
        backbone: '../lib/backbone/backbone',
        localStorage: '../lib/backbone/backbone.localStorage',
        webSocketsStorage: '../lib/backbone/backbone.webSocketsStorage',
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
        },
        webSocketsStorage: {
            deps: ["backbone"],
            exports: "webSocketsStorage"
        }
    }
});

require([
    'jquery',
    'backbone',
    'socket_io',
    'views/master-view',
    'collections/players',
    'models/story',
    'web-sockets-events-dispatcher',
    'collections/story-circles'
], function($,
            Backbone,
            SocketIO,
            MasterView,
            PlayerCollection,
            Story,
            SocketEventDispatcher,
            StoryCirclesCollection
    ) {

    var Router = Backbone.Router.extend({
        routes: {
            "": "main"
        },

        main: function(){


            this.gameRoomEvents = _.extend({}, Backbone.Events);

            this.players = new PlayerCollection(null, {
                gameRoomEvents: this.gameRoomEvents
            });

            this.story = new Story();

            this.storyCircles = new StoryCirclesCollection([{
                playerName: "Leena",
                storyCircleName: "Circle1",
                maxNumPlayers: 6
            },{
                playerName: "Leena",
                storyCircleName: "Circle2",
                maxNumPlayers: 6
            },{
                playerName: "Leena",
                storyCircleName: "Circle3",
                maxNumPlayers: 6
            },{
                playerName: "Leena",
                storyCircleName: "Circle4",
                maxNumPlayers: 6
            }]);

            this.dispatcher = new SocketEventDispatcher({
                players: this.players,
                story: this.story,
                storyCircles: this.storyCircles,
                gameRoomEvents: this.gameRoomEvents
            });

            var masterView = new MasterView({
                playerCollection: this.players,
                story: this.story,
                storyCircles: this.storyCircles,
                gameRoomEvents: this.gameRoomEvents,
                socketEvents: this.dispatcher
            });

            $("body").html(masterView.render().el).show();
        }
    });

    var router = new Router();
    Backbone.history.start();

});
