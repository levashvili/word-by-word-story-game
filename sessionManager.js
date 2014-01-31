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

var SessionManager = function(sessions) {

    this.sessions = sessions;
    this.initialize.apply(this, arguments);

}

_.extend(SessionManager.prototype, events.EventEmitter, {

    initialize: function() {

    },

    addSession: function(sessionId) {
        if(!_.findWhere(this.sessions, {sessionId: sessionId})) {
            this.sessions.push({sessionId:sessionId, storyCircle: null});
        }
    },

    addStoryCircle: function(sessionId, circle) {
        _.findWhere(this.sessions, {sessionId: sessionId}).storyCircle = circle;
    },

    getSession: function(sessionId) {
        var session = _.findWhere(this.sessions, {sessionId: sessionId})
        if(!session) {
            session = null;
        }
        return session;
    },

    getStoryCircle: function(circleId) {
        var session = _.find(this.sessions, function(session) {
            return (session.storyCircle) ? session.storyCircle.getId() == circleId : false;
        });
        if(session) {
            return session.storyCircle;
        } else {
            return null;
        }
    },

    getAllSessions: function() {
        return _.pluck(this.sessions, 'sessionId');
    },

    getAllStoryCircleIds: function() {
        var ids = [];
        _.each(this.sessions, function(session) {
            if(session.storyCircle) {
                ids.push(session.storyCircle.getId());
            }
        });
        return _.uniq(ids);
    },

    getAllStoryCircles: function() {
        var storyCircles = [];
        _.each(this.sessions, function(session) {
            if(session.storyCircle) {
                storyCircles.push(session.storyCircle);
            }
        });
        return _.uniq(storyCircles);
    },

    getCircleSubscribers: function(circleId) {
        var sessionIds = [];
        _.each(this.sessions, function(session) {
            if(session.storyCircle && (session.storyCircle.getId() === circleId)) {
                sessionIds.push(session.sessionId);
            }
        });
        return sessionIds;
    },

    getStoryCircleBySession: function(sessionId) {
        var circle = null;
        _.each(this.sessions, function(session) {
            if(session.sessionId == sessionId) {
                circle = session.storyCircle;
            }
        });
        return circle;
    },

    unSubscribeFromCircle: function(sessionId) {
        _.findWhere(this.sessions, {sessionId: sessionId}).storyCircle = null;
    },

    unSubscribeGlobally: function(sessionId) {
        this.sessions = _.reject(this.sessions, function(session){ return session.sessionId == sessionId; });
    },

    subscribeToCircle: function(sessionId, circleId) {
        var session = _.findWhere(this.sessions, {sessionId: sessionId});
//        session.storyCircle = _.findWhere(this.sessions, {sessionId: '1x112'}).storyCircle;
        var circle = _.find(this.sessions, function(session) {
            var test = (session.storyCircle) ? (session.storyCircle.getId() == circleId) : false;

            return test;
        });

//        console.log(util.inspect(circle));

        if(circle) {
            circle = circle.storyCircle;
        } else {
            circle = null;
        }
        if(session) {
            session.storyCircle = circle;
        } else {
            this.sessions.push({
                sessionId: sessionId,
                storyCircle: circle
            });
        }
    },

    getSessions: function() {
        return this.sessions;
    }

});


exports.SessionManager = SessionManager;