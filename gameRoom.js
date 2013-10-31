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
    events.EventEmitter.call(this);
    this.id = arg;
    console.log("new instance of game room created with id: " + this.id);
}

util.inherits(GameRoom, events.EventEmitter);

GameRoom.prototype.getId = function() {
    console.log("id of this game room is " + this.id);
};

GameRoom.prototype.generateEvent = function(message) {
    console.log('emitted gameRoomEvent: ' + message);
    this.emit('gameRoomEvent');
    this.getId();
    console.log('emitted gameRoomEvent: ' + message);
};

GameRoom.prototype.newPlayerJoins = function(id) {
    console.log("inspect players inside newPlayerJoins: " + util.inspect(this.players));
    this.players.push({id:id});
};

GameRoom.prototype.playerLeaves = function(playerId) {
    console.log("inspect players of the cloned object: " + util.inspect(this.players))
    var numberOfPlayers = this.players.length;
    for(index = 0; index < numberOfPlayers; index++) {
        var player = this.players[index];
        //console.log("player inside playerLeaves is :" + util.inspect(player));
        if(player.id == playerId) {
            this.players.splice(index,1);
            break;
        }
    }
};

GameRoom.prototype.getPlayers = function() {
    //deep clone players
    return JSON.parse(JSON.stringify(this.players));
};

GameRoom.prototype.getNextPlayerId = function() {
    //console.log("what is players here? " + message + " " + util.inspect(this.players));
    var numberOfPlayers = this.players.length;
    var currentPlayerIndex = this.currentPlayerIndex;
    var nextPlayerIndex = (numberOfPlayers > 0) ? (currentPlayerIndex + 1) % numberOfPlayers : -1;
    this.currentPlayerIndex = (nextPlayerIndex >= 0) ? nextPlayerIndex : this.currentPlayerIndex;
    return (nextPlayerIndex >= 0) ? (this.players[nextPlayerIndex].id) : null;
};

GameRoom.prototype.playerTakesBreak = function(id) {
    var i = this.players.indexOf({id:id, isOnBreak: false});
    var player = this.player[i];
    player.isOnBreak = true;
    this.players[i] = player;
};



exports.GameRoom = GameRoom;