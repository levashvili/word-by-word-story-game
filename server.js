/* 
 Module dependencies:

 - Express
 - Http (to run Express)
 - Underscore (because it's cool)
 - Socket.IO(Note: we need a web server to attach Socket.IO to)


 It is a common practice to name the variables after the module name.
 Ex: http is the "http" module, express is the "express" module, etc.
 The only exception is Underscore, where we use, conveniently, an underscore.
 Oh, and "socket.io" is simply called io. Seriously, the
 rest should be named after its module name.

 */
var express = require("express")
    , app = express()
    , http = require("http").createServer(app)
    , io = require("socket.io").listen(http)
    , _ = require("underscore")
    , g = require("./gameRoom")
    , util = require('util')
    , port = process.env.PORT || 5000
    , hostname = process.env.HOSTNAME || "leena-lemur-ultra.local";

/* Server config */
//Server's IP address
app.set("hostname", hostname);

//Server's port number 
app.set("port", port);

//Specify the views folder
app.set("views", __dirname + "/views");

//View engine is Jade
app.set("view engine", "jade");

//Specify where the static content is
app.use(express.static("public", __dirname + "/public"));

//Tells server to support JSON, urlencoded, and multipart requests
app.use(express.bodyParser());

/* Server routing */

//Handle route "GET /", as in "http://localhost:8080/"
app.get("/", function(request, response) {

    //Render the view called "index"
    response.render("index");

});

var gameRoom = new g.GameRoom(1);
gameRoom.on('gameRoomEvent', function(err, events) {

    _(events).each(function(event, index, events) {
        var connections = event.notify;
        _(connections).each(function(connection, index, connections) {
            console.log("element is " + util.inspect(connection));
            if(io.sockets.socket(connection)) {
                console.log("emitting to " + util.inspect(connection) + " event " + event.name + " data " + util.inspect(event.data));
                io.sockets.socket(connection).emit(event.name, event.data);
            }
        })
    });
})
/* Socket.IO events */

io.on("connection", function(socket) {
    var sessionId = socket.id;
    socket.on('playerEvent', function(data) {
        //gameRoom.playerJoinsGameRoom(sessionId);
        console.log("received playerEvent " + util.inspect(data));
        gameRoom.respondToPlayerEvent(data);
    });
    socket.on('disconnect', function () {

        gameRoom.respondToPlayerEvent({
            name: 'playerLeaves',
            data: {
                id: sessionId
            }
        });

    });
});

//Start the http server at port and IP defined before
http.listen(app.get("port"), app.get("ipaddr"), function() {
    console.log("Server up and running. Go to http://" + app.get("hostname") + ":" + app.get("port"));
});

