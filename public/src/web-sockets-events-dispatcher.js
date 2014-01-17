define([
    'jquery',
    'underscore',
    'backbone',
    'socket_io'
], function(jquery, _, Backbone, SocketIO) {

    //Backbone.View.extend({
    var Dispatcher = function() {
//        this.color = "red";
        this.sessionId = null;
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
                this.sessionId = this.socket.socket.sessionid;
                //console.log('Connected ' + sessionId);
                //socket.emit('newUser', {id: sessionId});
                console.log('client connected with session id ' + this.sessionId);
            }.bind(this));

            this.socket.on('receiveGameState', function (data) {
                //console.log('Connected ' + sessionId);
                //socket.emit('newUser', {id: sessionId});
                console.log('received game state');
                this.gameRoomEvents.trigger('players:resetPlayers', data.players);
            }.bind(this));
            /*

             */
            this.socket.on('beginPlaying', function (data) {
                console.log('begin  playing ');// + util.inspect(data));
                this.gameRoomEvents.trigger('gameRoom:playerJoined', data.players);
//                updatePlayers(data.players);
//                updateStory(data.story);
//                updateTurn(data.gameTurnPlayerId);
            }.bind(this));
            /*
             When the server emits the "newPlayerJoined" event, we'll reset
             the players section and display the participating players.
             Note we are assigning the sessionId as the span ID.
             */
            this.socket.on('newPlayerJoined', function (data) {
                //id
                //gameTurnPlayerId
                //name
                //players
                //updatePlayers(data.players);
                this.gameRoomEvents.trigger('players:addPlayer', {
                    id: data.id,
                    name: data.name
                });
                console.log('new player joined game ' + data.id);
//                updatePlayers(data.players);
//                updateTurn(data.gameTurnPlayerId);
            }.bind(this));
            /*
             When the player is taking a break, update status of players
             */
            this.socket.on('playerTookBreak', function(data) {
                //updatePlayers(data.players);
                console.log('player taking a break ' + data.id);
//                updatePlayers(data.players);
//                updateTurn(data.gameTurnPlayerId)
            }.bind(this));
            /*
             When the player is back from the break, update status of players
             */
            this.socket.on('playerReturnedFromBreak', function(data) {
                //updatePlayers(data.players);
                console.log('player comes back from break ' + data.id);
//                updatePlayers(data.players);
//                updateTurn(data.gameTurnPlayerId);
            }.bind(this));
            /*
             When the server emits the "playerLeavesGame" event, we'll
             remove the span element from the participants element
             */
            this.socket.on('playerLeft', function(data) {
                //$('#' + data.id).remove();
                console.log('player leaves game ' + data.id);
                this.gameRoomEvents.trigger('players:removePlayer', {
                    id: data.id,
                    name: data.name
                });
//                updatePlayers(data.players);
//                updateTurn(data.gameTurnPlayerId);
            }.bind(this));
            /*
             When receiving a new word event,
             we'll prepend it to the story
             */
            this.socket.on('playerSubmittedWord', function (data) {
//                updateStory(data.story);
//                updatePlayers(data.players);
//                updateTurn(data.gameTurnPlayerId);
                console.log('word submitted by a player ' + data.id);
            }.bind(this));
            /*
             Log an error if unable to connect to server
             */
            this.socket.on('error', function (reason) {
                console.log('Unable to connect to server', reason);
            }.bind(this));

        },

        joinGame: function(name) {
            this.socket.emit('playerEvent',
                {
                    name: 'newPlayerJoins',
                    data: {
                        id: this.sessionId,
                        name:name
                    }
                });
            console.log("emitted newPlayerJoins event");
        },

        submitWord: function(word) {
            socket.emit('playerEvent', {
                name: 'playerSubmitsWord',
                data: {
                    word: word,
                    id: this.sessionId
                }
            });
        },

        takeBreak: function() {
            this.socket.emit('playerEvent', {
                name: 'playerTakesBreak',
                data: {
                    id: this.sessionId
                }
            });
        },

        returnFromBreak: function() {
            this.socket.emit('playerEvent', {
                name: 'playerReturnsFromBreak',
                data: {
                    id: this.sessionId
                }
            });
        }
    });

    return Dispatcher;
});