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

    appendText: function(playerId, text) {
        var player = _.find(this.players, function(player) {
            return player.id == playerId;
        });
        if(player && player.gameTurn) {
            this.storyText = this.storyText + text + ' ';
            return true;
        } else {
            return false;
        }
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
    }

});


exports.GameRoom = GameRoom;