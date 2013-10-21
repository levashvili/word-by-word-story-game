/*
 User stories:
 This happens first:
    There are no connections
        Client
 This happens second:
 This happens third:

 1. 'Talking to the server when there are no other connections'     //context
    a. When I, as the web client, send a sockets request to the server //topic
        1. I receive a connect event    //vow
        2. socket variable contains sessionId field     //vow
        3. sessionId is not null    //vow
            'sending newUser event'     //context
            a. When I send the 'newUser' event to the server    //topic
                1. I receive a 'beginObserving' event           //vow
            'sending playerJoinsGame event'    //context
            a. When I send the 'playerJoinsGame' event to the server   //topic
                1. I receive a 'beginPlaying' event     vow
            'sending playerSubmitsWord event    //context
 */

var vows = require("vows");
var assert = require("assert");
var suite = vows.describe('server-test');
var socketIO = require("socket.io-client");
var domain = "leena-lemur-ultra.local:8080";
var _ = require("underscore");
var util = require("util");

function makeSocketConnectRequest(callback) {
    var socket = socketIO.connect(domain);
    socket.on('connect', function() {
        //console.log("received connect event");
        callback(null, socket);
    });
}

function sendNewUserEvent(callback, socket) {
    socket.emit('newUser', { id: 'xxxxxxx' });
    socket.on('beginObservingGame', function(data) {
        //console.log("data coming back from server: " + util.inspect(data));
        callback(null, data);
    })
}

function sendPlayerJoinsGameEvent(callback, socket) {
    socket.emit('playerJoinsGame', { id: 'xxxxxxx' });
    socket.on('beginPlaying', function(data) {
        //console.log("data coming back from server: " + util.inspect(data));
        callback(null, data);
    });
}

function sendPlayerRequestsBreakEvent(callback, socket) {
    socket.emit('playerRequestsBreak', { id: 'xxxxxxx' });
    socket.on('playerTakingBreak', function(data) {
        //console.log("data coming back from server: " + util.inspect(data));
        callback(null, data);
    });
}

suite.addBatch({
    'sending sockets request': {
        topic: function() {
            makeSocketConnectRequest(this.callback);
        },
        'get back connect event': function(err, socket) {
            //console.log("err is: " + util.inspect(err));
            //console.log("stat is: " + util.inspect(socket));
            //console.log("topic is: " + util.inspect(topic));
            assert.isNull(err);
            assert.isObject(socket);
        },
        'send newUser event': {
            topic: function(socket) {
                sendNewUserEvent(this.callback, socket);
            },
            'get back beginObservingGame event': function(err, data) {
                assert.isNull(err);
                assert.isObject(data);
                //console.log("data is: " + util.inspect(data));
            }
        },
        'send playerJoinsGame event': {
            topic: function(socket) {
                sendPlayerJoinsGameEvent(this.callback, socket);
            },
            'get back beginPlaying event': function(err, data) {
                assert.isNull(err);
                assert.isObject(data);
            }
        },
        'send playerRequestsBreak event': {
            topic: function(socket) {
                sendPlayerRequestsBreakEvent(this.callback, socket);
            },
            'get back playerTakingBreak event': function(err, data) {
                assert.isNull(err);
                assert.isObject(data);
            }
        }
    }
});

//suite.export(module);
suite.run();