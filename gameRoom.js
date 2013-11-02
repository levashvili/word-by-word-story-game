/**
 * Created by leena on 10/10/13.
 * Events received:
 * 'newUser'
 * 'playerJoinsGame'
 * 'playerSubmitsWord'
 * 'playerRequestsBreak'
 * 'playerReturnsFromBreak'
 * 'playerLeavesGame'
 *
 * Events sent:
 * 'beginObservingGame'
 * 'beginPlaying'
 * 'newPlayerJoinsGame'
 * 'playerTakingBreak'
 * 'playerReturningFromBreak'
 * 'playerLeavesGame'
 * 'incomingWord'
 *
 * Game states:
 *
 */
var events = require('events');
var util = require('util');
var _ = require('underscore');
/*
id: player id
isPlaying: true/false
isOnBreak: true/false
*/

function GameRoom (arg) {
    this.players = [];
    this.storyText = "";
    //index of the current player (whose turn it is) in the players array
    //-1 means the game hasn't started yet
    this.currentPlayerIndex = -1;
    this.gameTurnPlayerId = null;
    events.EventEmitter.call(this);
    this.id = arg;
    //var sources = [];
    //sources.push(arg);
    if(typeof arg == 'object') {
        _.extend(this, arg);
    }
    console.log("new instance of game room created: " + util.inspect(this));
}

util.inherits(GameRoom, events.EventEmitter);

GameRoom.prototype.respondToPlayerEvent = function(event) {
    switch (event.name) {
        case 'newPlayerJoins':
            this.newPlayerJoins(event.data.id);
            //this.emit('gameRoomEvent', null, data);
            break;
        case 'playerSubmitsWord':
            this.playerSubmitsWord(event.data.id, event.data.word);
        default:
            break;
    }
}

GameRoom.prototype.getPlayerIdsArray = function() {
    var playerIds = [];
    for(var index = 0; index < this.players.length; index++) {
        playerIds[index] = this.players[index].id;
    }
    return playerIds;
}

GameRoom.prototype.getId = function() {
    console.log("id of this game room is " + this.id);
};

GameRoom.prototype.generateEvent = function(message) {
    console.log('emitted gameRoomEvent: ' + message);
    this.emit('gameRoomEvent');
    this.getId();
    console.log('emitted gameRoomEvent: ' + message);
};

GameRoom.prototype.playerLeaves = function(playerId) {
    //console.log("inspect players of the cloned object: " + util.inspect(this.players))
    var numberOfPlayers = this.players.length;
    for(index = 0; index < numberOfPlayers; index++) {
        var player = this.players[index];
        //console.log("player inside playerLeaves is :" + util.inspect(player));
        if(player.id == playerId) {
            this.players.splice(index,1);
            break;
        }
    }
    //update next turn
    this.gameTurnPlayerId = this.getNextPlayerId();
};

GameRoom.prototype.getPlayers = function() {
    //deep clone players
    return JSON.parse(JSON.stringify(this.players));
};

GameRoom.prototype.getStoryText = function() {
    return this.storyText;
};

GameRoom.prototype.getGameTurnPlayerId = function() {
    return this.gameTurnPlayerId;
};

GameRoom.prototype.getNextPlayerId = function() {
    //console.log("what is players here? " + message + " " + util.inspect(this.players));
    var numberOfPlayers = this.players.length;
    var currentPlayerIndex = _(this.players).pluck('id').indexOf(this.gameTurnPlayerId);
    //in case all players are on break
    var moveToNext = 0
    var nextPlayerIndex = (numberOfPlayers > 0) ? (currentPlayerIndex + 1) % numberOfPlayers : -1;
    do {
        var nextPlayerIndex = (numberOfPlayers > 0) ? (currentPlayerIndex + 1) % numberOfPlayers : -1;
        var isOnBreak = (nextPlayerIndex >= 0) ? this.players[nextPlayerIndex].isOnBreak : false;
        currentPlayerIndex = nextPlayerIndex;
        moveToNext ++;
    } while (isOnBreak && (moveToNext <= numberOfPlayers))
    this.currentPlayerIndex = (currentPlayerIndex >= 0) ? currentPlayerIndex : this.currentPlayerIndex;
    return (nextPlayerIndex >= 0) ? (this.players[nextPlayerIndex].id) : null;
};

GameRoom.prototype.getCurrentTurnPlayerId = function() {
    return (this.currentPlayerIndex >= 0) ? this.players[this.currentPlayerIndex].id : null;
};

GameRoom.prototype.playerTakesBreak = function(playerId) {
    //console.log("1. players inside playerTakesBreak " + util.inspect(this.players));
    var numberOfPlayers = this.players.length;
    for(index = 0; index < numberOfPlayers; index++) {
        var player = this.players[index];
        if(player.id == playerId) {
            player.isOnBreak = true;
            break;
        }
    }
    //if it is this player's turn
    if(playerId == this.gameTurnPlayerId) {
        this.gameTurnPlayerId = this.getNextPlayerId();
    }
   //console.log("2. players inside playerTakesBreak " + util.inspect(this.players));
};

GameRoom.prototype.newPlayerJoins = function(id) {
    //console.log("inspect players inside newPlayerJoins: " + util.inspect(this.players));
    if(this.players.length == 0) {
        this.currentPlayerIndex = 0;
    }
    this.players.push({id:id});
    //notify other players
    var notify = this.getPlayerIdsArray();
    var event = {
        name: 'newPlayerJoined',
        data: {
            id:id,
            notify:notify
        }
    };
    this.emit('gameRoomEvent', null, event);
};

GameRoom.prototype.playerSubmitsWord = function(playerId, word) {
    //update story only if correct player
    if(playerId != this.gameTurnPlayerId) return;
    this.storyText = this.storyText + " " + word;
    //notify other players
    var notify = _(this.players).pluck('id');
    var event = {
        name: 'playerSubmittedWord',
        data: {
            id:playerId,
            story: this.getStoryText(),
            notify:notify
        }
    };
    this.emit('gameRoomEvent', null, event);
    //move to next player
    this.gameTurnPlayerId = this.getNextPlayerId();
};

exports.GameRoom = GameRoom;