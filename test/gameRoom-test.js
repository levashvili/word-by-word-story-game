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

function applyOptions(context, options) {
    if(options.expectedNextPlayerId) {
        context['assert proper player turn'] = contexts.assertProperPlayerTurn(options.expectedNextPlayerId);
    }
    if(options.expectedNumberOfPlayers){
        context['assert correct number of players - '] = contexts.assertCorrectNumberOfPlayers(options.expectedNumberOfPlayers);
    }
    if(options.expectedStoryText) {
        context['assert correct story text - '] = contexts.assertCorrectStoryText(options.expectedStoryText);
    }
    if(options.doEventCapture) {
        context['receive event - '] = vows.receiveGameRoomEvent();
    }
}
/*
 player turn
 list of players/status
 story text
 status of the story/game - not externally controllable

 place game in a specified state?
 how many players?
    what is their status?
    whose turn is it?
 story text
*/

var vows = {
    assertNumberOfPlayers: function (numberPlayers) {
        return function (players) {
        assert.lengthOf(players, numberPlayers);
        };
    },

    assertStoryText: function(text) {
        return function (storyText) {
        assert.equal(storyText, text);
        };
    },

    assertPlayerId: function(id) {
        return function (playerId) {
        assert.equal(playerId, id);
        }
    },

    receiveGameRoomEvent: function() {
        return function(data) {
            console.log("receiving event: " + util.inspect(data));
            assert.isObject(data);
        }
    }
};

var contexts = {
    assertProperPlayerTurn: function(playerId) {
        var shouldStmt = "should be " + playerId;
        var context = {
            topic: topicActions.getGameTurnPlayerId()
        };
        context[shouldStmt] = vows.assertPlayerId(playerId);
        return context;
    },
    assertCorrectNumberOfPlayers: function(expectedNumberOfPlayers) {
        var shouldStmt = "should be " + expectedNumberOfPlayers;
        var context = {
            topic: topicActions.getPlayers()
        };
        context[shouldStmt] = vows.assertNumberOfPlayers(expectedNumberOfPlayers);
        return context;
    },
    assertCorrectStoryText: function(expectedStoryText) {
        var shouldStmt = "should be correct text";
        var context = {
            topic: topicActions.getStoryText()
        };
        context[shouldStmt] = vows.assertStoryText(expectedStoryText);
        return context;
    },
    playerSubmitsWord: function (options) {
        var context = {
            topic: topicActions.playerSubmitsWord(options.playerId, options.word, options.doEventCapture)
        }
        applyOptions(context, options);
        return context;
    },
    playerLeavesGame: function (options) {
        var context = {
            topic: topicActions.playerLeavesGame(options.playerId)
        }
        applyOptions(context,options);
        return context;
    },
    playerTakesBreak: function (options) {
        var context = {
            topic: topicActions.playerTakesBreak(options.playerId),
            'assert proper player turn - ': contexts.assertProperPlayerTurn(options.expectedNextPlayerId),
            'assert correct number of players - ': contexts.assertCorrectNumberOfPlayers(options.expectedNumberOfPlayers)
        }
        return context;
    },
    newPlayerJoins: function (options) {
        var context = {
            topic: topicActions.newPlayerJoins(options.playerId, options.doEventCapture)
        }
        applyOptions(context, options);
        return context;
    }
}

var topicActions = {
    getPlayers: function () {
        return function (gameRoom) {
            return gameRoom.getPlayers();
        };
    },
    createGameRoom: function (options) {
        return function() {
            var gameRoom = new g.GameRoom(options);
            return gameRoom;
        }
    },
    getStoryText: function () {
        return function (gameRoom) {
            return gameRoom.getStoryText();
        };
    },
    getGameTurnPlayerId: function () {
        return function (gameRoom) {
            return gameRoom.getGameTurnPlayerId();
        };
    },
    playerSubmitsWord: function(playerId, word, doEventCapture) {
        return function (gameRoom) {
            if(doEventCapture) {
                var callback = this.callback;
                gameRoom.on('gameRoomEvent', callback);
            }
            gameRoom.playerSubmitsWord(playerId, word);
            if(!doEventCapture){
                return gameRoom;
            }
        }
    },
    playerLeavesGame: function(playerId) {
        return function (gameRoom) {
            gameRoom.playerLeaves(playerId);
            return gameRoom;
        }
    },
    playerTakesBreak: function(playerId) {
        return function (gameRoom) {
            gameRoom.playerTakesBreak(playerId);
            return gameRoom;
        }
    },
    newPlayerJoins: function(playerId, doEventCapture) {
        return function (gameRoom) {
            if(doEventCapture) {
                var callback = this.callback;
                gameRoom.on('gameRoomEvent', callback);
            }
            gameRoom.newPlayerJoins(playerId);
            if(!doEventCapture) {
                return gameRoom;
            }
        }
    }
};
suite.addBatch({
    'create new game room - ': {
        topic: topicActions.createGameRoom({
            players: [{id:1},{id:2},{id:3}],
            storyText: "Once upon a time, in the kingdom of Dawn",
            gameTurnPlayerId: 1,
            id:1
        }),
        'assert number of players - ': {
            topic: topicActions.getPlayers(),
            'should be 3': vows.assertNumberOfPlayers(3)
        },
        'assert story text - ': {
            topic: topicActions.getStoryText(),
            'should be correct text': vows.assertStoryText('Once upon a time, in the kingdom of Dawn')
        },
        'assert proper player turn - ': {
            topic: topicActions.getGameTurnPlayerId(),
            'should be 1': vows.assertPlayerId(1)
        }
    },
    'game room with 3 players - ': {
        topic: topicActions.createGameRoom({
            players: [{id:1},{id:2},{id:3}],
            storyText: "Once upon a time, in the kingdom of Dawn",
            gameTurnPlayerId: 1,
            id:1
        }),
        'player 1 submits word - ': {
            topic: topicActions.playerSubmitsWord(1, "there"),
            'assert proper player turn - ': {
                topic: topicActions.getGameTurnPlayerId(),
                'should be 2': vows.assertPlayerId(2)
            },
            'assert story text - ': {
                topic: topicActions.getStoryText(),
                'should be correct text': vows.assertStoryText('Once upon a time, in the kingdom of Dawn there')
            }
        }

    },
    'going back to beginning of player queue - ': {
        topic: topicActions.createGameRoom({
            players: [{id:1},{id:2},{id:3}],
            storyText: "Once upon a time, in the kingdom of Dawn",
            gameTurnPlayerId: 3,
            id:1
        }),
        'player 3 submits word - ': contexts.playerSubmitsWord({
            playerId: 3,
            expectedNextPlayerId: 1,
            word: "there"
        })
    },
    'player leaves game on his turn - ': {
        topic: topicActions.createGameRoom({
            players: [{id:1},{id:2},{id:3}],
            storyText: "Once upon a time, in the kingdom of Dawn",
            gameTurnPlayerId: 3,
            id:1
        }),
        'player 3 leaves game - ': contexts.playerLeavesGame({
            playerId: 3,
            expectedNextPlayerId: 1,
            expectedNumberOfPlayers: 2
        })
    },
    'player takes break on his turn - ': {
        topic: topicActions.createGameRoom({
            players: [{id:1},{id:2},{id:3}],
            storyText: "Once upon a time, in the kingdom of Dawn",
            gameTurnPlayerId: 3,
            id:1
        }),
        'player 3 takes break - ': contexts.playerTakesBreak({
            playerId: 3,
            expectedNextPlayerId: 1,
            expectedNumberOfPlayers: 3
        })
    },
    'player submits word not on his turn - ': {
        topic: topicActions.createGameRoom({
            players: [{id:1},{id:2},{id:3}],
            storyText: "Once upon a time, in the kingdom of Dawn",
            gameTurnPlayerId: 3,
            id:1
        }),
        'player 2 submits word - ': contexts.playerSubmitsWord({
            playerId: 2,
            word: "there",
            expectedNextPlayerId: 3,
            expectedNumberOfPlayers: 3,
            expectedStoryText: "Once upon a time, in the kingdom of Dawn"
        })
    },
    'new player joins': {
        topic: topicActions.createGameRoom({
            players: [{id:1},{id:2},{id:3}],
            storyText: "Once upon a time, in the kingdom of Dawn",
            gameTurnPlayerId: 3,
            id:1
        }),
        'new player joins - ': contexts.newPlayerJoins({
            playerId: 4,
            expectedNextPlayerId: 3,
            expectedNumberOfPlayers: 4,
            expectedStoryText: "Once upon a time, in the kingdom of Dawn"
        })
    },
    'capture event after new player joins': {
        topic: topicActions.createGameRoom({
            players: [{id:1},{id:2},{id:3}],
            storyText: "Once upon a time, in the kingdom of Dawn",
            gameTurnPlayerId: 3,
            id:1
        }),
        'new player joins - ': contexts.newPlayerJoins({
            playerId: 4,
            doEventCapture: true
        })
    },
    'capture event after player submits word': {
        topic: topicActions.createGameRoom({
            players: [{id:1},{id:2},{id:3}],
            storyText: "Once upon a time, in the kingdom of Dawn",
            gameTurnPlayerId: 1,
            id:1
        }),
        'new player joins - ': contexts.playerSubmitsWord({
            playerId: 1,
            word: "there",
            doEventCapture: true
        })
    }
    /*,
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
                return gameRoom.getCurrentTurnPlayerId();
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
        '3rd player takes a break - ': {
            topic: function(gameRoom) {
                //clone gameRoom
                var gameRoomClone = clone(gameRoom);
                gameRoomClone.playerTakesBreak(3);
                return gameRoomClone;
            },
            'getting player turns': {
                'getting 1st player in line - ': {
                    topic: function(gameRoom) {
                        console.log(gameRoom);
                        return gameRoom.getCurrentTurnPlayerId();
                    },
                    'should be 1': function(playerId) {
                        assert.equal(playerId, 1);
                    },
                    'getting 3rd player in line - ': {
                        topic: function(arg1, gameRoom) {
                            gameRoom.getNextPlayerId();
                            return gameRoom.getNextPlayerId();
                        },
                        'should be 4': function(playerId) {
                            assert.equal(playerId, 4);
                        },
                        'getting 4th player in line - ': {
                            topic: function(arg1, arg2, gameRoom) {
                                return gameRoom.getNextPlayerId();
                            },
                            'should be 5': function(playerId) {
                                assert.equal(playerId, 5);
                            },
                            'all players take a break - ': {
                                topic: function(arg1, arg2, arg3, gameRoom) {
                                    gameRoom.playerTakesBreak(1);
                                    gameRoom.playerTakesBreak(2);
                                    gameRoom.playerTakesBreak(3);
                                    gameRoom.playerTakesBreak(4);
                                    gameRoom.playerTakesBreak(5);
                                    return gameRoom;
                                },
                                'getting next player id - ': {
                                    topic: function(gameRoom) {
                                        return gameRoom.getNextPlayerId();
                                    },
                                    'should be 1': function(playerId) {
                                        assert.equal(playerId, 1);
                                    }
                                }
                            }
                        }
                    }
                }
            }
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
            },
            'getting a list of players - ': {
                topic: function(gameRoom) {
                    return gameRoom.getPlayers();
                },
                'should be 4 players': function(players) {
                    assert.equal(players.length, 4);
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
    },

    'creating new game room - ': {
        topic: function() {
            var gameRoom = new g.GameRoom(4);
            return gameRoom;
        },
        'adding a new player with id 1': {
            topic: function(gameRoom) {
                var callback = this.callback;
                gameRoom.on('gameRoomEvent', callback);
                gameRoom.respondToPlayerEvent({
                    name:'newPlayerJoins',
                    data:{
                        id:1
                    }
                });
            },
            'receiving event': function(event) {
                //console.log("received event: " + util.inspect(event));
            }
        },
        'adding a new player with id 2': {
            topic: function(gameRoom) {
                var callback = this.callback;
                gameRoom.on('gameRoomEvent', callback);
                gameRoom.respondToPlayerEvent({
                    name:'newPlayerJoins',
                    data:{
                        id:2
                    }
                });
            },
            'receiving event': function(event) {
                //console.log("received event: " + util.inspect(event));
            }
        }
    },

    'creating gameRoom with 2 players': {
        topic: function() {
            var gameRoom = new g.GameRoom(5);
            gameRoom.respondToPlayerEvent({
                name:'newPlayerJoins',
                data:{
                    id:1
                }
            });
            gameRoom.respondToPlayerEvent({
                name:'newPlayerJoins',
                data:{
                    id:2
                }
            });
            return gameRoom;
        },
        'player 1 submits a word': {
            topic: function(gameRoom) {
                var promise = new(events.EventEmitter);
                gameRoom.on('gameRoomEvent', function (arg1, arg2) {
                    if (arg1) {
                        console.log("error " + util.inspect(arg1));
                        promise.emit('error', arg1)
                    }
                    else   {
                        console.log("success " + util.inspect(arg2));
                        promise.emit('success', arg2)
                    }
                });
                gameRoom.respondToPlayerEvent({
                    name:'playerSubmitsWord',
                    data:{
                        id:1,
                        word: "Once"
                    }
                });
                return promise;
            },
            'notify other players of new word': function(data) {
                //console.log("1. err is: " + util.inspect(err));
                console.log("1. event is: " + util.inspect(data));
                //event.data.story = "blah blah blah";
                //console.log("event received 1: " + util.inspect(event));
            },
            'player 2 submits word': {
                topic: function(gameRoom) {
                    console.log("inspect gameRoom: " + util.inspect(gameRoom));
                    var promise = new(events.EventEmitter);
                    gameRoom.on('gameRoomEvent', function (arg1, arg2) {
                        if (arg1) {
                            console.log("error " + util.inspect(arg1));
                            promise.emit('error', arg1)
                        }
                        else   {
                            console.log("success " + util.inspect(arg2));
                            promise.emit('success', arg2)
                        }
                    });
                    gameRoom.respondToPlayerEvent({
                        name:'playerSubmitsWord',
                        data:{
                            id:2,
                            word: "upon"
                        }
                    });
                    return promise;
                },
                'notify other players of new word': function(data) {
                    console.log("2. event received: " + util.inspect(data));
                    //event.data.story = "blah blah blah";
                    //console.log("event received: " + util.inspect(event));
                }
            }
        }
    }
    */

});

//suite.export(module);
suite.run();

/*
inputs (player events - things that happen externally)
gameRoom.newPlayerJoins
gameRoom.playerLeaves
gameRoom.playerRequestsBreak
gameRoom.playerReturnsFromBreak
gameRoom.playerSubmitsWord
state of the game
gameRoom.addNewPlayer
gameRoom.removePlayer
gameRoom.receivePlayerSubmission
gameRoom.grantPlayerBreak
gameRoom.returnPlayerFromBreak

outputs (gameRoom events - messages sent to players)
give turn to next player
notify players that
    new player joins
    a player leaves
    a player takes a break

internal states/values/counters (public information)
player turn
list of players/status
story text
status of the story/game
 */



