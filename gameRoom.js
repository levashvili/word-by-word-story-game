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
            this.newPlayerJoins(event.data.id, event.data.name);
            //this.emit('gameRoomEvent', null, data);
            break;
        case 'playerSubmitsWord':
            this.playerSubmitsWord(event.data.id, event.data.word);
            break;
        case 'playerTakesBreak':
            this.playerTakesBreak(event.data.id);
            break;
        case 'playerReturnsFromBreak':
            this.playerReturnsFromBreak(event.data.id);
            break;
        case 'playerLeaves':
            this.playerLeaves(event.data.id);
            break;
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
    /*
    turn goes to next player who is not on break,
    if there is only one such player in the game, and he has had his turn already,
    move to next player who is on break

    if the turn belongs to a player who is on break, and another player returns from break,
    or joins game, move turn to that player
    */
    var numberOfPlayers = this.players.length;
    //if no players, exit
    if(numberOfPlayers == 0) {
        return -1;
    }

    var gameTurnPlayerId = (this.gameTurnPlayerId) ? this.gameTurnPlayerId : _(this.players).first().id;
    var nextPlayerId = null;
    var gameTurnPlayerIndex = _(this.players).pluck('id').indexOf(gameTurnPlayerId);
    var indexOfId = 0;
    var indexOfIndex = 2;
    var indexOfIsOnBreak = 1
    var playersZip = _.zip(_(this.players).pluck('id'), _(this.players).pluck('isOnBreak'),
        _.range(0, numberOfPlayers));
    var otherPlayersZip = _(playersZip).filter(function(playerArr){ return playerArr[indexOfId]!=gameTurnPlayerId;});
    var otherPlayersZipGroup = _(otherPlayersZip).groupBy(
        function(playerArr) {return (playerArr[indexOfIndex] > gameTurnPlayerIndex) ? 0 : 1;}
    );
    //var otherPlayersArrGrouped = _.zip(_(this.players).pluck('id'), _(this.players).pluck('isOnBreak'),
    //    _.range(0, numberOfPlayers)).filter(function(playerArr){ return playerArr[indexOfId]!=gameTurnPlayerId;}).groupBy(
    //        function(playerArr) {return playerArr[indexOfIndex] > gameTurnPlayerIndex;}
    //    );
    var otherPlayersArrSorted = _.union(otherPlayersZipGroup[0], otherPlayersZipGroup[1]).filter(function(elem){return _(elem).isArray()});
    //next player not on break
    var nextPlayer = _(otherPlayersArrSorted).find(function(playerArr) {return !playerArr[indexOfIsOnBreak];});
    if(!nextPlayer) { //there is no such player
        //get the first player
        nextPlayer = _(otherPlayersArrSorted).first();
    }

    if(nextPlayer) {
        nextPlayerId = nextPlayer[indexOfId];
    } else {
        nextPlayerId = this.gameTurnPlayerId;
    }

    return nextPlayerId;
};

GameRoom.prototype.getCurrentTurnPlayerId = function() {
    return (this.currentPlayerIndex >= 0) ? this.players[this.currentPlayerIndex].id : null;
};

GameRoom.prototype.newPlayerJoins = function(id, name) {
    //if player with this id exists, exit
    if(_(_(this.players).pluck('id')).intersection([id]).length > 0) {
        return;
    }
    //if gameTurnPlayerId is null, set it here for the first time
    //or if current gameTurnPlayer is on break, give this player turn
    if(!this.gameTurnPlayerId || this.players[_(this.players).pluck('id').indexOf(this.gameTurnPlayerId)].isOnBreak) {
        this.gameTurnPlayerId = id;
    }
    //also if all other players are on break, give this player turn
    if(_(this.players).pluck('isOnBreak').filter(function(isOnBreak) {return !(isOnBreak);}).length == 0) {
        this.gameTurnPlayerId = id;
    }
    //if(_(_(this.players).pluck('isOnBreak')).intersection([id]).length > 0) {
    //    return;
    //}

    //console.log("inspect players inside newPlayerJoins: " + util.inspect(this.players));
    if(this.players.length == 0) {
        this.currentPlayerIndex = 0;
    }
    this.players.push({id:id, name: name});
    //notify other players
    var notifyOthers =_(_(this.players).pluck('id')).without([id]);
    var notifyNewPlayer = [id];
    var events = [
        {
            name: 'newPlayerJoined',
            data: {
                id:id,
                name: name,
                players: this.getPlayers(),
                gameTurnPlayerId:this.gameTurnPlayerId
            },
            notify: notifyOthers
        },
        {
            name: 'beginPlaying',
            data: {
                players: this.getPlayers(),
                story: this.getStoryText(),
                gameTurnPlayerId:this.gameTurnPlayerId
            },
            notify: notifyNewPlayer
        }
    ];
    console.log("emit game room events " + util.inspect(events));
    this.emit('gameRoomEvent', null, events);

};

GameRoom.prototype.playerSubmitsWord = function(playerId, word) {
    //update story only if correct player
    if(playerId != this.gameTurnPlayerId) return;
    this.storyText = this.storyText + " " + word;
    //notify other players
    this.gameTurnPlayerId = this.getNextPlayerId();
    var notify = _(this.players).pluck('id');
    var events = [{
            name: 'playerSubmittedWord',
            data: {
                id: playerId,
                story: this.getStoryText(),
                gameTurnPlayerId: this.gameTurnPlayerId,
                players: this.getPlayers()
            },
            notify: notify
        }];
    this.emit('gameRoomEvent', null, events);
    //move to next player and notify of turn
};

GameRoom.prototype.playerTakesBreak = function(playerId) {
    //console.log("1. players inside playerTakesBreak " + util.inspect(this.players));
    var numberOfPlayers = this.players.length;
    for(var index = 0; index < numberOfPlayers; index++) {
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
    //notify players that player takes break
    var notify = _(this.players).pluck('id');
    var event = [{
        name: 'playerTookBreak',
        data: {
            id:playerId,
            gameTurnPlayerId:this.gameTurnPlayerId,
            players: this.getPlayers()
        },
        notify: notify
    }];
    this.emit('gameRoomEvent', null, event);
};

GameRoom.prototype.isOnBreak = function(playerId) {
    var playerIndex = _(this.players).pluck('id').indexOf(playerId);
    return (this.players[playerIndex].isOnBreak) ? true : false;
}

GameRoom.prototype.playerReturnsFromBreak = function(playerId) {
    //console.log("1. players inside playerTakesBreak " + util.inspect(this.players));
    var numberOfPlayers = this.players.length;
    for(var index = 0; index < numberOfPlayers; index++) {
        var player = this.players[index];
        if(player.id == playerId) {
            player.isOnBreak = false;
            break;
        }
    }
    //if current game turn is with a player who's on break, give turn to this player
    if(!this.gameTurnPlayerId || this.isOnBreak(this.gameTurnPlayerId)) {
        this.gameTurnPlayerId = playerId;
    }
    //notify players that player returns from break
    var notify = _(this.players).pluck('id');
    var event = [{
        name: 'playerReturnedFromBreak',
        data: {
            id:playerId,
            gameTurnPlayerId: this.gameTurnPlayerId,
            players: this.getPlayers()
        },
        notify: notify
    }];
    this.emit('gameRoomEvent', null, event);
};

GameRoom.prototype.playerLeaves = function(playerId) {
    //console.log("inspect players of the cloned object: " + util.inspect(this.players))
    //check if valid player, otherwise exit
    if(_(_(this.players).pluck('id')).intersection([playerId]).length == 0) {
        return;
    }

    var numberOfPlayers = this.players.length;
    for(var index = 0; index < numberOfPlayers; index++) {
        var player = this.players[index];
        //console.log("player inside playerLeaves is :" + util.inspect(player));
        if(player.id == playerId) {
            this.players.splice(index,1);
            break;
        }
    }
    //if no players left in the game
    if(this.players.length == 0) {
        this.gameTurnPlayerId = null;
    } else {
        //update next turn if if was this players turn
        if(this.gameTurnPlayerId == playerId) {
            this.gameTurnPlayerId = this.getNextPlayerId();
        }
        var notify = _(this.players).pluck('id');
        var events = [{
            name: 'playerLeft',
            data: {
                id:playerId,
                gameTurnPlayerId: this.gameTurnPlayerId,
                players:this.getPlayers()
            },
            notify: notify
        }];


        this.emit('gameRoomEvent', null, events);
    }
};

exports.GameRoom = GameRoom;