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
    , GameRoom = require("./gameRoom")
    , util = require('util');

http.listen(port);/* Server config */

var connections = [];
var gameRoom = new GameRoom.GameRoom(1);
var emitToAllConnections = function(event, data) {
    _(connections).each(function(connection, index, connections) {
        console.log("element is " + util.inspect(connection));
        if(io.sockets.socket(connection.sessionId)) {
            console.log("emitting to " + util.inspect(connection));
            io.sockets.socket(connection.sessionId).emit(event, data);
        }
    })
};

/* Socket.IO events */

io.on("connection", function(socket) {
    connections.push({
        sessionId: socket.id,
        playerId: socket.id
    });

    socket.emit('players', gameRoom.getPlayers());
    socket.emit('story', gameRoom.getStoryText());

    socket.on('player', function(player) {
        console.log("received player event " + util.inspect(player));
        gameRoom.addPlayer(player);
        emitToAllConnections('players', gameRoom.getPlayers());
    });

    socket.on('story', function(text) {
        console.log("received story event " + util.inspect(text));
        if(gameRoom.appendText(socket.id, text)) {
            emitToAllConnections('story', text);
            emitToAllConnections('players', gameRoom.getPlayers());
        }
    })

    socket.on('disconnect', function () {

        gameRoom.removePlayer(socket.id);
        connections = _.reject(connections, function(connection) {
            connection.sessionId == socket.id;
        });
        emitToAllConnections('players', gameRoom.getPlayers());
    });
});

//Start the http server at port and IP defined before
//http.listen(app.get("port"), app.get("ipaddr"), function() {
//    console.log("Server up and running. Go to http://" + app.get("hostname") + ":" + app.get("port"));
//});

