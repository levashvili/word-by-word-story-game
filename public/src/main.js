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

require([
    'jquery',
    'backbone',
    'localStorage',
    'socket_io',
    'views/master-view',
    'collections/players',
    'models/story',
    'collections/paragraphs',
    'web-sockets-events-dispatcher',
    'models/player',
    'views/welcome',
    'views/navigation'
], function($,
            Backbone,
            LocalStorage,
            SocketIO,
            MasterView,
            PlayerCollection,
            Story,
            ParagraphsCollection,
            SocketEventDispatcher,
            Player,
            WelcomeView,
            NavigationView
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

            this.dispatcher = new SocketEventDispatcher({
                players: this.players,
                story: this.story,
                gameRoomEvents: this.gameRoomEvents
            });

            var masterView = new MasterView({
                playerCollection: this.players,
                story: this.story,
                gameRoomEvents: this.gameRoomEvents,
                socketEvents: this.dispatcher
            });

            var welcomeView = new WelcomeView();
            var navigationView = new NavigationView();

            $("#navigation").html(navigationView.render().el).show();
            $("#welcome").html(welcomeView.render().el).show();
        }
    });

    var router = new Router();
    Backbone.history.start();

});
