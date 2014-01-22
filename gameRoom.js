/**
 * Created by leena on 10/10/13.
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

var GameRoom = function(args) {

    this.initialize.apply(this, arguments);

}

//util.inherits(GameRoom, events.EventEmitter);

_.extend(GameRoom.prototype, events.EventEmitter, {

    initialize: function(args) {
        this.players = [];
        this.storyText = "";
        //index of the current player (whose turn it is) in the players array
        //-1 means the game hasn't started yet
        this.currentPlayerIndex = -1;
        this.gameTurnPlayerId = null;
        events.EventEmitter.call(this);
        this.id = arguments[0];
        //var sources = [];
        //sources.push(arg);
        if(typeof arguments[0] == 'object') {
            _.extend(this, arguments[0]);
        }
        console.log("new instance of game room created: " + util.inspect(this));
    },

    addPlayer: function(player) {
        var existing = _.find(this.players, function(existingPlayer){
            return existingPlayer.id == player.id;
        });

        var defaults = {
            "id": null,
            "name":  "",
            "takingBreak": false,
            "gameTurn": false
        };

        if(existing) {
            _.extend(existing, player)
        } else {
            this.players.push(_.extend(defaults, player));
        }
    },

    removePlayer: function(id) {
        this.players = _.reject(this.players, function(player){ return player.id == id; });
    },

    getPlayerIdsArray: function() {
        var playerIds = [];
        for(var index = 0; index < this.players.length; index++) {
            playerIds[index] = this.players[index].id;
        }
        return playerIds;
    },

    getId: function() {
        console.log("id of this game room is " + this.id);
    },

    getPlayers: function() {
        //deep clone players
        if(this.currentPlayerIndex >= 0 && this.players.length >= 1) {
            this.players[this.currentPlayerIndex].gameTurn = "true";
        }
        return JSON.parse(JSON.stringify(this.players));
    },

    getStoryText: function() {
        return this.storyText;
    },

    getGameTurnPlayerId: function() {
        return this.gameTurnPlayerId;
    },

    getNextPlayerId: function() {
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
    },

    getCurrentTurnPlayerId: function() {
        return (this.currentPlayerIndex >= 0) ? this.players[this.currentPlayerIndex].id : null;
    }
});


exports.GameRoom = GameRoom;