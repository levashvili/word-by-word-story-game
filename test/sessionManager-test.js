var vows = require("vows");
var assert = require("assert");
var suite = vows.describe('sessionManager-test');
var _ = require("underscore");
var util = require("util");
var sessionManager = require("../sessionManager");
var events = require("events");
var eventEmitter = new events.EventEmitter();

var mockStoryCircle = function(id) {
    this.id = id;
};
_.extend(mockStoryCircle.prototype, {
   getId: function() {
       return this.id;
   }
});

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
    'when creating a sessions object': {
        topic: function () {
            var sessions = [];
            var circle1 = new mockStoryCircle('sc1x111');
            var circle2 = new mockStoryCircle('sc1x112');
            sessions.push({sessionId:'1x111', storyCircle: circle1});
            sessions.push({sessionId:'1x112', storyCircle: circle2});
            sessions.push({sessionId:'1x113', storyCircle: new mockStoryCircle('sc1x113')});
            sessions.push({sessionId:'1x114', storyCircle: null});
            sessions.push({sessionId:'1x115', storyCircle: circle1});
//            sessions.push({sessionId:'1x116', storyCircle: circle2});
            return new sessionManager.SessionManager(sessions);
        },
        'we can get a list of sessionIds': function(sessionManager) {
            assert.isArray(sessionManager.getAllSessions());
            assert.lengthOf(sessionManager.getAllSessions(), 5);
        },
        'we can get a list of circleIds': function(sessionManager) {
            assert.isArray(sessionManager.getAllStoryCircleIds());
            assert.lengthOf(sessionManager.getAllStoryCircleIds(), 3);
        },
        'we can get all story circles': function(sessionManager) {
            assert.isArray(sessionManager.getAllStoryCircles());
            assert.lengthOf(sessionManager.getAllStoryCircles(), 3);
        },
        'we can get circle subscribers': function(sessionManager) {
            assert.isArray(sessionManager.getCircleSubscribers('sc1x111'));
            assert.lengthOf(sessionManager.getCircleSubscribers('sc1x111'), 2);
        },
        'we can get storyCircle by session': function(sessionManager) {
            assert.equal(sessionManager.getStoryCircleBySession('1x111').getId(), 'sc1x111');
        },
        'we can un-subscribe from circle': function(sessionManager) {
            sessionManager.unSubscribeFromCircle('1x111');
            assert.lengthOf(sessionManager.getCircleSubscribers('sc1x111'), 1);
        },
        'and subscribe to circle': function(sessionManager) {
            sessionManager.subscribeToCircle('1x111', 'sc1x112');
            assert.lengthOf(sessionManager.getCircleSubscribers('sc1x112'), 2);
//            assert.lengthOf(sessionManager.getSessions(), 2);
        },
        'we can add session': function(sessionManager) {
            assert.lengthOf(sessionManager.getSessions(), 5);
            sessionManager.addSession('1x116');
            assert.lengthOf(sessionManager.getSessions(), 6);
        },
        'we can add story circle': function(sessionManager) {
//            assert.lengthOf(sessionManager.getSessions(), 4);
            assert.lengthOf(sessionManager.getAllStoryCircles(), 3);
            sessionManager.addStoryCircle('1x116', new mockStoryCircle('sc1x116'));
            assert.lengthOf(sessionManager.getAllStoryCircles(), 4);
//            assert.lengthOf(sessionManager.getSessions(), 4);
        },
        'we can un-subscribe globally': function(sessionManager) {
            assert.isNotNull(sessionManager.getSession('1x116'));
            sessionManager.unSubscribeGlobally('1x116');
            assert.isNull(sessionManager.getSession('1x116'));
        }

    }

}).run(); // Run it