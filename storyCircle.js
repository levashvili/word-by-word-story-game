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

var StoryCircle = function(args) {

    this.initialize.apply(this, arguments);

}

_.extend(StoryCircle.prototype, events.EventEmitter, {

    initialize: function(args) {
        this.players = [];
        this.storyText = "";
        events.EventEmitter.call(this);
        this.id = args.storyCircleId;
        this.name = args.storyCircleName;
        this.maxNumPlayers = args.maxNumPlayers;
        this.addPlayer({
            "id": args.playerId,
            "name":  args.playerName
        });

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
        var previousPlayersList = this.players;
        this.players = _.reject(this.players, function(player){ return player.id == id; });
        if(previousPlayersList.length > this.players.length) {
            return true;
        } else {
            return false;
        }
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
        return JSON.parse(JSON.stringify(this.players));
    },

    getStoryText: function() {
        return this.storyText;
    },

    getId: function() {
        return this.id;
    },

    getName: function() {
        return this.name;
    },

    getMaxNumPlayers: function() {
        return this.maxNumPlayers;
    }
});


exports.StoryCircle = StoryCircle;