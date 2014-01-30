var vows = require("vows");
var assert = require("assert");
var suite = vows.describe('storyCircle-test');
var _ = require("underscore");
var util = require("util");
var StoryCircle = require("../storyCircle");
var events = require("events");
var eventEmitter = new events.EventEmitter();

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

    'when creating a story Circle': {
        topic: function() {return new StoryCircle.StoryCircle({
            playerId: '1xx123',
            playerName: 'Leena',
            storyCircleId: 'sc1xx123',
            storyCircleName: 'leena\'s',
            maxNumPlayers: 2
        })},
        'we get an object': function(storyCircle) {
//            console.log(util.inspect(topic));
            assert.isObject(storyCircle);
        },
        'that has a getPlayers method': function(storyCircle) {
            assert.isFunction(storyCircle.getPlayers);
        },
        'that has a addPlayer method': function(storyCircle) {
            assert.isFunction(storyCircle.addPlayer);
        },
        'that has a removePlayer method': function(storyCircle) {
            assert.isFunction(storyCircle.removePlayer);
        },
        'we can get a list of players': function(storyCircle) {
            assert.isArray(storyCircle.getPlayers());
        },
        'list of players has one player initially': function(storyCircle) {
            assert.lengthOf(storyCircle.getPlayers(),1);
        },
        'we can add a player to it with id and name': function(storyCircle) {
            storyCircle.addPlayer({
                id: 1,
                name: 'John'
            });
            assert.lengthOf(storyCircle.getPlayers(), 2);
            assert.equal(storyCircle.getPlayers()[1].name, 'John');
        },
        'and update a player': function(storyCircle) {
            storyCircle.addPlayer({
                id: 1,
                name: 'Leena'
            });
            assert.lengthOf(storyCircle.getPlayers(), 2);
            assert.equal(storyCircle.getPlayers()[1].name, 'Leena');
        },
        'and remove a player': function(storyCircle) {
            storyCircle.removePlayer(1);
            storyCircle.removePlayer('1xx123');
            assert.lengthOf(storyCircle.getPlayers(), 0);
        },
        'a player can have a game turn': function(storyCircle) {
            storyCircle.addPlayer({
                id: 1,
                name: 'Leena',
                gameTurn: true
            });
            assert.equal(storyCircle.getPlayers()[0].gameTurn, true);
        },
        'and can add text to story on his turn': function(storyCircle) {
            storyCircle.appendText(1, 'Once upon a time');
            assert.equal(storyCircle.getStoryText(), 'Once upon a time ');
        },
        'but not if it\'s not his turn': function(storyCircle) {
            storyCircle.addPlayer({
                id: 2,
                name: 'Leam'
            });
            storyCircle.appendText(2, 'there lived a young prince');
            assert.equal(storyCircle.getStoryText(), 'Once upon a time ');
        }
    }
}).run(); // Run it