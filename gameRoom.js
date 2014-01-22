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
        var gameTurn = {
            gameTurn: false
        }
        //see if game turn belongs to another player
        var gameTurnPlayer = _.find(this.players, function(existingPlayer){
            return (existingPlayer.gameTurn && existingPlayer.id !== player.id);
        });
        //if not, set this player as game turn player
        if(!gameTurnPlayer) {
            gameTurn = {
                gameTurn:true
            }
        }
        //if that player is on break
        if(gameTurnPlayer && gameTurnPlayer.takingBreak) {
            gameTurnPlayer.gameTurn = false;
            gameTurn = {
                gameTurn: true
            }
        }

        var existing = _.find(this.players, function(existingPlayer){
            return existingPlayer.id == player.id;
        });

        var defaults = {
            "id": null,
            "name":  "",
            "takingBreak": false
        };

        if(existing) {
            //if taking a break and has game turn
            if(player.takingBreak && existing.gameTurn) {
                //transfer game turn to next player who is not on break
                _.each(_(this.players).where({takingBreak: false}), function(existingPlayer, index, players) {
                    //if player to be removed has the turn
                    if(existingPlayer.id == existing.id) {
                        //transfer turn to next player in line
                        players[(index + 1) % players.length].gameTurn = true;
                    }
                });
                gameTurn = {
                    gameTurn: false
                };
            }
            _.extend(existing, player, gameTurn)
        } else {
            this.players.push(_.extend(defaults, player, gameTurn));
        }
    },

    removePlayer: function(id) {
        //for a subset of players that are not on break
        _.each(_(this.players).where({takingBreak: false}), function(player, index, players) {
            //if player to be removed has the turn
            if(player.id == id && player.gameTurn) {
                //transfer turn to next player in line
                players[(index + 1) % players.length].gameTurn = true;
            }
        });
        this.players = _.reject(this.players, function(player){ return player.id == id; });
    },

    appendText: function(playerId, text) {
        var player = _.find(this.players, function(player) {
            return player.id == playerId;
        });
        if(player && player.gameTurn) {
            this.storyText = this.storyText + text + ' ';
            //shift turn to next player
            _.each(_(this.players).where({takingBreak: false}), function(player, index, players) {
                //if player to be removed has the turn
                if(player.id == playerId && player.gameTurn) {
                    //transfer turn to next player in line
                    player.gameTurn = false;
                    players[(index + 1) % players.length].gameTurn = true;
                }
            });
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