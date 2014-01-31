/* 
 Module dependencies:

 - Express
 - Http (to run Express)
 - Underscore (because it's cool)
 - Socket.IO(Note: we need a web server to attach Socket.IO to)

 */
var
      connect = require('connect')
    , port = process.env.PORT || 5000
    , hostname = process.env.HOSTNAME || "leena-lemur-ultra.local"
    , app = connect()
        .use(connect.logger('dev'))
        .use(connect.static('public'))
        .use(connect.directory('public'))
        .use(connect.cookieParser())
        .use(connect.session({ secret: 'my secret here' }))
        .use(function(req, res){
            res.end('Hello from Connect!\n');
        })
    , http = require("http").createServer(app)
    , io = require("socket.io").listen(http)
    , _ = require("underscore")
    , StoryCircle = require("./storyCircle")
    , sessionManager = require("./sessionManager")
    , util = require('util');

http.listen(port);/* Server config */


var getStoryCirclesData = function(storyCircles) {
    var circles = [];
    _.each(storyCircles, function(circle) {
       circles.push({
           id: circle.getId(),
           storyCircleName: circle.getName(),
           maxNumPlayers: circle.getMaxNumPlayers()
       });
    });
    return circles;
};

var sessionManager = new sessionManager.SessionManager([]);

var generateUid = function (separator) {
    /// <summary>
    ///    Creates a unique id for identification purposes.
    /// </summary>
    /// <param name="separator" type="String" optional="true">
    /// The optional separator for grouping the generated segmants: default "-".
    /// </param>

    var delim = separator || "-";

    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
};

var emitToSessions = function(event, data, sessionIds) {
    _(sessionIds).each(function(sessionId) {
        console.log("element is " + sessionId);
        if(io.sockets.socket(sessionId)) {
            console.log("emitting to " + sessionId);
            io.sockets.socket(sessionId).emit(event, data);
        }
    })
};

/* Socket.IO events */

io.on("connection", function(socket) {

    socket.on('subscribe:global', function() {
        sessionManager.addSession(socket.id);
        socket.emit('global:storyCircles:reset', getStoryCirclesData(sessionManager.getAllStoryCircles()));
    });

    socket.on('global:storyCircles:add', function(storyCircle) {
        console.log("received story circle event " + util.inspect(storyCircle));
        var circle = new StoryCircle.StoryCircle({
            playerId: socket.id,
            playerName: storyCircle.playerName,
            storyCircleId: generateUid(),
            storyCircleName: storyCircle.storyCircleName,
            maxNumPlayers: storyCircle.maxNumPlayers
        });

        sessionManager.addStoryCircle(socket.id, circle);

        emitToSessions('global:storyCircles:add', {
            id: circle.getId(),
            storyCircleName: circle.getName(),
            maxNumPlayers: circle.getMaxNumPlayers()
        }, sessionManager.getAllSessions());
    });

    socket.on('subscribe:storyCircle', function(circleId) {
        sessionManager.subscribeToCircle(socket.id, circleId);
        var circle = sessionManager.getStoryCircle(circleId);
        if(circle) {
            socket.emit('storyCircle:players:reset',
                circle.getPlayers()
            );
            socket.emit('storyCircle:story:reset',
                circle.getStoryText()
            );
        }

    });

    socket.on('storyCircle:players:add', function(player) {
        console.log("received player event " + util.inspect(player));
        var circle = sessionManager.getStoryCircleBySession(socket.id);
        if(circle) {
            circle.addPlayer(player);
            emitToSessions('storyCircle:players:reset',
                circle.getPlayers(), sessionManager.getCircleSubscribers(circle.getId()));
        }

    })

    socket.on('storyCircle:story:append', function(text) {
        console.log("received story event " + util.inspect(text));
        var circle = sessionManager.getStoryCircleBySession(socket.id);
        if(circle) {
            if(circle.appendText(socket.id, text)) {
                emitToSessions('storyCircle:story:append', text,
                    sessionManager.getCircleSubscribers(circle.getId())
                );
                emitToSessions('StoryCircle:players:reset',
                    circle.getPlayers(),
                    sessionManager.getCircleSubscribers(circle.getId())
                );
            }

        }
    })

    socket.on('disconnect', function () {
        //unSubscribe
        var circle = sessionManager.getStoryCircleBySession(socket.id);
        if(circle) {
            sessionManager.unSubscribeFromCircle(socket.id);
            if(circle.removePlayer(socket.id)) {
                emitToSessions('storyCircle:players:reset', circle.getPlayers(),
                    sessionManager.getCircleSubscribers(circle.getId())
                );
            }
        }
        sessionManager.unSubscribeGlobally(socket.id);


    });
});

//Start the http server at port and IP defined before
//http.listen(app.get("port"), app.get("ipaddr"), function() {
//    console.log("Server up and running. Go to http://" + app.get("hostname") + ":" + app.get("port"));
//});

