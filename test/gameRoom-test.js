var vows = require("vows");
var assert = require("assert");
var suite = vows.describe('gameRoom-test');
var _ = require("underscore");
var util = require("util");
var GameRoom = require("../gameRoom");
var events = require("events");
var eventEmitter = new events.EventEmitter();

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
        if(options.expectedNoEventTimeout) { //event should not happen
            var should = "assert no event within " + options.expectedNoEventTimeout + " seconds - ";
            context[should] = vows.receiveTimeoutEvent();
        } else {
            context['assert receive event - '] = vows.receiveGameRoomEvent();
        }
    }
    if(options.subContexts) {
        for(subContextTag in options.subContexts) {
            context[subContextTag] = options.subContexts[subContextTag];
        }
    }
}

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
            topic: topicActions.playerSubmitsWord(options.playerId, options.word, options.doEventCapture, options.expectedNoEventTimeout)
        }
        applyOptions(context, options);
        return context;
    },
    playerLeavesGame: function (options) {
        var context = {
            topic: topicActions.playerLeavesGame(options.playerId, options.doEventCapture, options.expectedNoEventTimeout)
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
    playerReturnsFromBreak: function (options) {
        var context = {
            topic: topicActions.playerReturnsFromBreak(options.playerId),
        }
        applyOptions(context, options);
        return context;
    },
    newPlayerJoins: function (options) {
        var context = {
            topic: topicActions.newPlayerJoins(options.playerId, options.doEventCapture, options.expectedNoEventTimeout)
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
    playerSubmitsWord: function(playerId, word, doEventCapture, expectedNoEventTimeoutSecs) {
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
    playerLeavesGame: function(playerId, doEventCapture, expectedNoEventTimeout) {
        return function (gameRoom) {
            if(doEventCapture) {
                var callback = this.callback;
                gameRoom.on('gameRoomEvent', callback);

                if(expectedNoEventTimeout) {
                    var timeoutEvent = [{
                        name: 'timeoutEvent'
                    }]
                    setTimeout(callback, expectedNoEventTimeout, null, timeoutEvent)
                }
            }
            gameRoom.playerLeaves(playerId);
            if(!doEventCapture) {
                return gameRoom;
            }
        }
    },
    playerTakesBreak: function(playerId) {
        return function (gameRoom) {
            gameRoom.playerTakesBreak(playerId);
            return gameRoom;
        }
    },
    playerReturnsFromBreak: function(playerId) {
        return function (gameRoom) {
            gameRoom.playerReturnsFromBreak(playerId);
            return gameRoom;
        }
    },
    newPlayerJoins: function(playerId, doEventCapture, expectedNoEventTimeoutSecs) {
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
            //console.log("receiving event: " + util.inspect(data));
            assert.isArray(data);
        }
    },

    receiveTimeoutEvent: function() {
        return function(data) {
            //console.log("receiving event: " + util.inspect(data));
            assert.equal(data[0].name, "timeoutEvent");
        }
    }
};

suite.addBatch({
    'when dividing a number by zero': {
        topic: function () { return 42 / 0 },

        'we get Infinity': function (topic) {
            assert.equal (topic, Infinity);
        }
    },
    'but when dividing zero by zero': {
        topic: function () { return 0 / 0 },

        'we get a value which': {
            'is not a number': function (topic) {
                assert.isNaN (topic);
            },
            'is not equal to itself': function (topic) {
                assert.notEqual (topic, topic);
            }
        }
    },

    'when creating a game room': {
        topic: function() {return new GameRoom.GameRoom()},
        'we get an object': function(gameRoom) {
//            console.log(util.inspect(topic));
            assert.isObject(gameRoom);
        },
        'that has a getPlayers method': function(gameRoom) {
            assert.isFunction(gameRoom.getPlayers);
        },
        'that has a addPlayer method': function(gameRoom) {
            assert.isFunction(gameRoom.addPlayer);
        },
        'that has a removePlayer method': function(gameRoom) {
            assert.isFunction(gameRoom.removePlayer);
        },
        'we can get a list of players': function(gameRoom) {
            assert.isArray(gameRoom.getPlayers());
        },
        'list of players is empty initially': function(gameRoom) {
            assert.isEmpty(gameRoom.getPlayers());
        },
        'we can add a player to it with id and name': function(gameRoom) {
            gameRoom.addPlayer({
                id: 1,
                name: 'John'
            });
            assert.lengthOf(gameRoom.getPlayers(), 1);
            assert.equal(gameRoom.getPlayers()[0].name, 'John');
        },
        'and update a player': function(gameRoom) {
            gameRoom.addPlayer({
                id: 1,
                name: 'Leena'
            });
            assert.lengthOf(gameRoom.getPlayers(), 1);
            assert.equal(gameRoom.getPlayers()[0].name, 'Leena');
        },
        'and remove a player': function(gameRoom) {
            gameRoom.removePlayer(1);
            assert.lengthOf(gameRoom.getPlayers(), 0);
        },
        'a player can have a game turn': function(gameRoom) {
            gameRoom.addPlayer({
                id: 1,
                name: 'Leena',
                gameTurn: true
            });
            assert.equal(gameRoom.getPlayers()[0].gameTurn, true);
        },
        'and can add text to story on his turn': function(gameRoom) {
            gameRoom.appendText(1, 'Once upon a time');
            assert.equal(gameRoom.getStoryText(), 'Once upon a time ');
        },
        'but not if it\'s not his turn': function(gameRoom) {
            gameRoom.addPlayer({
                id: 2,
                name: 'Leam'
            });
            gameRoom.appendText(2, 'there lived a young prince');
            assert.equal(gameRoom.getStoryText(), 'Once upon a time ');
        }
    }
}).run(); // Run it
//suite.addBatch({
//    'create new game room - ': {
//        topic: topicActions.createGameRoom({
//            players: [{id:'id1'},{id:'id2'},{id:'id3'}],
//            storyText: "Once upon a time, in the kingdom of Dawn",
//            gameTurnPlayerId: 'id1',
//            id:1
//        }),
//        'assert number of players - ': {
//            topic: topicActions.getPlayers(),
//            'should be 3': vows.assertNumberOfPlayers(3)
//        },
//        'assert story text - ': {
//            topic: topicActions.getStoryText(),
//            'should be correct text': vows.assertStoryText('Once upon a time, in the kingdom of Dawn')
//        },
//        'assert proper player turn - ': {
//            topic: topicActions.getGameTurnPlayerId(),
//            'should be id1': vows.assertPlayerId('id1')
//        }
//    },
//    'game room with 3 players - ': {
//        topic: topicActions.createGameRoom({
//            players: [{id:1},{id:2},{id:3}],
//            storyText: "Once upon a time, in the kingdom of Dawn",
//            gameTurnPlayerId: 1,
//            id:1
//        }),
//        'player 1 submits word - ': {
//            topic: topicActions.playerSubmitsWord(1, "there"),
//            'assert proper player turn - ': {
//                topic: topicActions.getGameTurnPlayerId(),
//                'should be 2': vows.assertPlayerId(2)
//            },
//            'assert story text - ': {
//                topic: topicActions.getStoryText(),
//                'should be correct text': vows.assertStoryText('Once upon a time, in the kingdom of Dawn there')
//            }
//        }
//
//    },
//    'going back to beginning of player queue - ': {
//        topic: topicActions.createGameRoom({
//            players: [{id:1},{id:2},{id:3}],
//            storyText: "Once upon a time, in the kingdom of Dawn",
//            gameTurnPlayerId: 3,
//            id:1
//        }),
//        'player 3 submits word - ': contexts.playerSubmitsWord({
//            playerId: 3,
//            expectedNextPlayerId: 1,
//            word: "there"
//        })
//    },
//    'player leaves game on his turn - ': {
//        topic: topicActions.createGameRoom({
//            players: [{id:1},{id:2},{id:3}],
//            storyText: "Once upon a time, in the kingdom of Dawn",
//            gameTurnPlayerId: 3,
//            id:1
//        }),
//        'player 3 leaves game - ': contexts.playerLeavesGame({
//            playerId: 3,
//            expectedNextPlayerId: 1,
//            expectedNumberOfPlayers: 2
//        })
//    },
//    'player takes break on his turn - ': {
//        topic: topicActions.createGameRoom({
//            players: [{id:1},{id:2},{id:3}],
//            storyText: "Once upon a time, in the kingdom of Dawn",
//            gameTurnPlayerId: 3,
//            id:1
//        }),
//        'player 3 takes break - ': contexts.playerTakesBreak({
//            playerId: 3,
//            expectedNextPlayerId: 1,
//            expectedNumberOfPlayers: 3
//        })
//    },
//    'player submits word not on his turn - ': {
//        topic: topicActions.createGameRoom({
//            players: [{id:1},{id:2},{id:3}],
//            storyText: "Once upon a time, in the kingdom of Dawn",
//            gameTurnPlayerId: 3,
//            id:1
//        }),
//        'player 2 submits word - ': contexts.playerSubmitsWord({
//            playerId: 2,
//            word: "there",
//            expectedNextPlayerId: 3,
//            expectedNumberOfPlayers: 3,
//            expectedStoryText: "Once upon a time, in the kingdom of Dawn"
//        })
//    },
//    'new player joins': {
//        topic: topicActions.createGameRoom({
//            players: [{id:1},{id:2},{id:3}],
//            storyText: "Once upon a time, in the kingdom of Dawn",
//            gameTurnPlayerId: 3,
//            id:1
//        }),
//        'new player joins - ': contexts.newPlayerJoins({
//            playerId: 4,
//            expectedNextPlayerId: 3,
//            expectedNumberOfPlayers: 4,
//            expectedStoryText: "Once upon a time, in the kingdom of Dawn"
//        })
//    },
//    'capture event after new player joins': {
//        topic: topicActions.createGameRoom({
//            players: [{id:'id1'},{id:'id2'},{id:'id3'}],
//            storyText: "Once upon a time, in the kingdom of Dawn",
//            gameTurnPlayerId: 'id3',
//            id:1
//        }),
//        'new player joins - ': contexts.newPlayerJoins({
//            playerId: 'id4',
//            doEventCapture: true
//        })
//    },
//    'capture event after player submits word - ': {
//        topic: topicActions.createGameRoom({
//            players: [{id:'id1'},{id:'id2'},{id:'id3'}],
//            storyText: "Once upon a time, in the kingdom of Dawn",
//            gameTurnPlayerId: 'id1',
//            id:1
//        }),
//        'player submits word - ': contexts.playerSubmitsWord({
//            playerId: 'id1',
//            word: "there",
//            doEventCapture: true
//        })
//    },
//    'adding player with same id twice - ': {
//        topic: topicActions.createGameRoom({
//            players: [{id:1},{id:2},{id:3}],
//            storyText: "Once upon a time, in the kingdom of Dawn",
//            gameTurnPlayerId: 1,
//            id:1
//        }),
//        'player joins with existing id - ': contexts.newPlayerJoins({
//            playerId: 3,
//            expectedNumberOfPlayers: 3,
//            expectedNextPlayerId: 1,
//            expectedStoryText: "Once upon a time, in the kingdom of Dawn"
//        })
//    },
//    'player leaves with non-existent player id - ': {
//        topic: topicActions.createGameRoom({
//            players: [{id:1},{id:2},{id:3}],
//            storyText: "Once upon a time, in the kingdom of Dawn",
//            gameTurnPlayerId: 1,
//            id:1
//        }),
//        'player leaves with id 4 - ': contexts.playerLeavesGame({
//            playerId: 4,
//            expectedNumberOfPlayers: 3,
//            expectedNextPlayerId: 1,
//            expectedStoryText: "Once upon a time, in the kingdom of Dawn"
//        })
//    },
//    'player leaves with non-existent player id - test callback - ': {
//        topic: topicActions.createGameRoom({
//            players: [{id:1},{id:2},{id:3}],
//            storyText: "Once upon a time, in the kingdom of Dawn",
//            gameTurnPlayerId: 1,
//            id:1
//        }),
//        'player leaves with id 4 - ': contexts.playerLeavesGame({
//            playerId: 4,
//            doEventCapture: true,
//            expectedNoEventTimeout: 2000 //in case we expect event not to happen
//        })
//    },
//    'one player on break - ': {
//        topic: topicActions.createGameRoom({
//            players: [{id:1, isOnBreak:true}],
//            storyText: "Once upon a time, in the kingdom of Dawn",
//            gameTurnPlayerId: 1,
//            id:1
//        }),
//        'another player joins - ': contexts.newPlayerJoins({
//            playerId: 2,
//            expectedNextPlayerId: 2,
//            expectedNumberOfPlayers: 2,
//            expectedStoryText: "Once upon a time, in the kingdom of Dawn"
//        })
//    },
//    'two players, first player on break, another submits word - ': {
//        topic: topicActions.createGameRoom({
//            players: [{id:1, isOnBreak:true}, {id:2, isOnBreak:false}],
//            storyText: "Once upon a time, in the kingdom of Dawn",
//            gameTurnPlayerId: 2,
//            id:1
//        }),
//        'second player submits word - ': contexts.playerSubmitsWord({
//            playerId: 2,
//            expectedNextPlayerId: 1
//        })
//    },
//    'two players, one on break, turn with player on break - ': {
//        topic: topicActions.createGameRoom({
//            players: [{id:1, isOnBreak:true}, {id:2, isOnBreak:false}],
//            storyText: "Once upon a time, in the kingdom of Dawn",
//            gameTurnPlayerId: 1,
//            id:1
//        }),
//        'third player joins - ': contexts.newPlayerJoins({
//            playerId: 3,
//            expectedNextPlayerId: 3
//        })
//    },
//    'three players, two on break, turn with player on break - ': {
//        topic: topicActions.createGameRoom({
//            players: [{id:1, isOnBreak:true}, {id:2, isOnBreak:false}, {id:3, isOnBreak:true}],
//            storyText: "Once upon a time, in the kingdom of Dawn",
//            gameTurnPlayerId: 1,
//            id:1
//        }),
//        'third player returns from break - ': contexts.playerReturnsFromBreak({
//            playerId: 3,
//            expectedNextPlayerId: 3
//        })
//    },
//    'new player joins after the only player leaves game - ': {
//        topic: topicActions.createGameRoom({
//            players: [{id:1}],
//            storyText: "",
//            gameTurnPlayerId: 1,
//            id:1
//        }),
//        'player leaves game - ': contexts.playerLeavesGame({
//            playerId: 1,
//            subContexts: {
//                'new player joins - ': contexts.newPlayerJoins({
//                    playerId: 2,
//                    expectedNextPlayerId: 2,
//                    expectedNumberOfPlayers: 1
//                })
//            }
//        })
//    }
////    'only player leaves - ': {
////        topic: topicActions.createGameRoom({
////            players: [{id:1}],
////            storyText: "",
////            gameTurnPlayerId: 1,
////            id:1
////        }),
////        'player leaves game - ': contexts.playerLeavesGame({
////            playerId: 1,
////            expectedNumberOfPlayers: 0
////        })
////    }
//});
//
//suite.export(module);
//suite.run();



