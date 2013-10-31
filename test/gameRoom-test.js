var vows = require("vows");
var assert = require("assert");
var suite = vows.describe('gameRoom-test');
var _ = require("underscore");
var util = require("util");
var g = require("../gameRoom");
var events = require("events");
var eventEmitter = new events.EventEmitter();
//var module = require("module");

function extend(destination, source) {
    for (var k in source) {
        destination[k] = source[k];
    }
    return destination;
}

function clone(instanceToClone) {
    //copy properties
    var clonedInstance = (JSON.parse(JSON.stringify(instanceToClone)));
    //copy methods
    //clonedInstance.constructor.prototype.__proto__ = instanceToClone.constructor.prototype;
    extend(clonedInstance.constructor.prototype, instanceToClone.constructor.prototype);
    return clonedInstance;
}

suite.addBatch({
    '1st player joins game room': {
        topic: function() {
            var gameRoom = new g.GameRoom(1);
            gameRoom.newPlayerJoins(1);
            return gameRoom;
        },
        'check getPlayers': {
            topic: function(gameRoom) {
                return gameRoom.getPlayers();
            },
            'should return 1 player': function(players) {
                assert.equal(players.length, 1);
            },
            'should contain player with id 1': function(players) {
                var player = players.pop();
                assert.equal(player.id, 1);
            }
        },
        'check getNextPlayerId': {
            topic: function(gameRoom) {
                return gameRoom.getNextPlayerId();
            },
            'should return player with id 1': function(playerId) {
                assert.equal(playerId, 1);
            }
        }
    },
    '5 players join game room - ': {
        topic: function() {
            var gameRoom = new g.GameRoom(2);
            gameRoom.newPlayerJoins(1);
            gameRoom.newPlayerJoins(2);
            gameRoom.newPlayerJoins(3);
            gameRoom.newPlayerJoins(4);
            gameRoom.newPlayerJoins(5);
            return gameRoom;
        },

        '2nd player leaves - ': {
            topic: function(gameRoom) {
                //create a clone of gameRoom
                var gameRoom1 = clone(gameRoom);
                gameRoom1.playerLeaves(2);
                return gameRoom1;
            },
            'getting player after id = 1 - ': {
                topic: function(gameRoom) {
                    //id = 1
                    console.log("inspect gameRoom: " + util.inspect(gameRoom));
                    gameRoom.getNextPlayerId();
                    //id = 3
                    return gameRoom.getNextPlayerId();
                    //return 4;
                },
                'should be player with id = 3': function(playerId) {
                    assert.equal(playerId, 3);
                }
            }
        },
        'player with non-existent id leaves - ': {
            topic: function(gameRoom) {
                //create a clone of gameRoom
                var gameRoom1 = clone(gameRoom);
                gameRoom1.playerLeaves(43);
                return gameRoom1;
            },
            'getting next player id - ': {
                topic: function(gameRoom) {
                    return gameRoom.getNextPlayerId();
                },
                'should be 1': function(playerId) {
                    assert.equal(playerId, 1);
                }
            }
        },
        'getting id of first player in queue - ' : {
            topic: function(gameRoom) {
                //var gameRoom1 = clone(gameRoom);
                return gameRoom.getNextPlayerId();
            },
            'should be player 1': function(playerId) {
                assert.equal(playerId, 1);
            },
            'getting id of 5th player in queue - ' : {
                topic: function(arg1, gameRoom) {
                    //2nd
                    gameRoom.getNextPlayerId();
                    //3nd
                    gameRoom.getNextPlayerId();
                    //4nd
                    gameRoom.getNextPlayerId();
                    //5nd
                    return gameRoom.getNextPlayerId();
                },
                'should be 5th player': function(playerId) {
                    assert.equal(playerId, 5);
                },
                'going back to beginning of the line - ' : {
                    topic: function(arg1, arg2, gameRoom) {
                        return gameRoom.getNextPlayerId();
                    },
                    'should be 1st player': function(playerId) {
                        assert.equal(playerId, 1);
                    }
                }
            }
        }
    }
});

//suite.export(module);
suite.run();





