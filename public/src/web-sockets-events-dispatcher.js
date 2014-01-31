define([
    'jquery',
    'underscore',
    'backbone',
    'socket_io'
], function(jquery, _, Backbone, SocketIO) {

    //Backbone.View.extend({
    var Dispatcher = function() {
        this.initialize.apply(this, arguments);
    };

    _.extend(Dispatcher.prototype, Backbone.Events, {

        initialize: function(opt) {

            _.extend(this, opt);

            this.socket = SocketIO.connect();

            /*
             When the client successfully connects to the server, an
             event "connect" is emitted. Let's get the session ID and
             log it. Also, let the socket.IO server know there's a new user
             with a session ID. We'll emit the "newUser" event
             for that.
             */
            this.socket.on('connect', function () {
                this.players.setAvatarId(this.socket.socket.sessionid);
                //subscribe to global events
                console.log('subscribing to global stream');
                this.socket.emit('subscribe:global');
            }.bind(this));

            this.socket.on('players', function(players) {
                this.players.reset(players);
                console.log('received players event');
            }.bind(this));

            this.socket.on('story', function(text) {
                console.log('received story event');
                this.story.set('text', this.story.get('text') + text);

            }.bind(this));

            this.socket.on('global:storyCircles:add', function(storyCircle) {
                console.log('received global:storyCircles:add event');
                this.storyCircles.add(storyCircle);
            }.bind(this));

            this.socket.on('global:storyCircles:reset', function(storyCircles) {
                console.log('received global:storyCircles:reset event');
                this.storyCircles.reset(storyCircles);
            }.bind(this));

            this.socket.on('error', function (reason) {
                console.log('Unable to connect to server', reason);
            }.bind(this));

//            this.storyCircles.on('add', this.createStoryCircle);

        },

        joinGame: function(name) {
            this.socket.emit('player', {
                id: this.players.getAvatarId(),
                name: name
            });
            console.log("emitted newPlayerJoins event");
        },

        submitText: function(text) {
            this.socket.emit('story', text);
        },

        takeBreak: function() {
            console.log('taking break')
            this.socket.emit('player', {
                id: this.players.getAvatarId(),
                takingBreak: true
            });
        },

        returnFromBreak: function() {
            console.log('returning from break');
            this.socket.emit('player', {
                id: this.players.getAvatarId(),
                takingBreak: false
            });
        },

        createStoryCircle: function(attributes) {
            this.socket.emit('global:storyCircles:add', {
                playerName: attributes.playerName,
                storyCircleName: attributes.storyCircleName,
                maxNumPlayers: attributes.maxNumPlayers
            });
        },

        enterStoryCircle: function(storyCircleId) {
            console.log('subscribing to story circle ' + storyCircleId);
            this.socket.emit('subscribe:storyCircle', storyCircleId);
        }
    });

    return Dispatcher;
});

