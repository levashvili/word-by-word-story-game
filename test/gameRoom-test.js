var vows = require("vows");
var assert = require("assert");
var suite = vows.describe('gameRoom-test');
var _ = require("underscore");
var util = require("util");
var g = require("../gameRoom");
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
}

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
    'capture event after player submits word - ': {
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
    },
    'adding player with same id twice - ': {
        topic: topicActions.createGameRoom({
            players: [{id:1},{id:2},{id:3}],
            storyText: "Once upon a time, in the kingdom of Dawn",
            gameTurnPlayerId: 1,
            id:1
        }),
        'player joins with existing id - ': contexts.newPlayerJoins({
            playerId: 3,
            expectedNumberOfPlayers: 3,
            expectedNextPlayerId: 1,
            expectedStoryText: "Once upon a time, in the kingdom of Dawn"
        })
    },
    'player leaves with non-existent player id - ': {
        topic: topicActions.createGameRoom({
            players: [{id:1},{id:2},{id:3}],
            storyText: "Once upon a time, in the kingdom of Dawn",
            gameTurnPlayerId: 1,
            id:1
        }),
        'player leaves with id 4 - ': contexts.playerLeavesGame({
            playerId: 4,
            expectedNumberOfPlayers: 3,
            expectedNextPlayerId: 1,
            expectedStoryText: "Once upon a time, in the kingdom of Dawn"
        })
    },
    'player leaves with non-existent player id - test callback - ': {
        topic: topicActions.createGameRoom({
            players: [{id:1},{id:2},{id:3}],
            storyText: "Once upon a time, in the kingdom of Dawn",
            gameTurnPlayerId: 1,
            id:1
        }),
        'player leaves with id 4 - ': contexts.playerLeavesGame({
            playerId: 4,
            doEventCapture: true,
            expectedNoEventTimeout: 2000 //in case we expect event not to happen
        })
    },
    'one player on break - ': {
        topic: topicActions.createGameRoom({
            players: [{id:1, isOnBreak:true}],
            storyText: "Once upon a time, in the kingdom of Dawn",
            gameTurnPlayerId: 1,
            id:1
        }),
        'another player joins - ': contexts.newPlayerJoins({
            playerId: 2,
            expectedNextPlayerId: 2,
            expectedNumberOfPlayers: 2,
            expectedStoryText: "Once upon a time, in the kingdom of Dawn"
        })
    },
    'two players, first player on break, another submits word - ': {
        topic: topicActions.createGameRoom({
            players: [{id:1, isOnBreak:true}, {id:2, isOnBreak:false}],
            storyText: "Once upon a time, in the kingdom of Dawn",
            gameTurnPlayerId: 2,
            id:1
        }),
        'second player submits word - ': contexts.playerSubmitsWord({
            playerId: 2,
            expectedNextPlayerId: 1
        })
    },
    'two players, one on break, turn with player on break - ': {
        topic: topicActions.createGameRoom({
            players: [{id:1, isOnBreak:true}, {id:2, isOnBreak:false}],
            storyText: "Once upon a time, in the kingdom of Dawn",
            gameTurnPlayerId: 1,
            id:1
        }),
        'third player joins - ': contexts.newPlayerJoins({
            playerId: 3,
            expectedNextPlayerId: 3
        })
    }
});

//suite.export(module);
suite.run();



