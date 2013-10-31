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
    , gameRoom = require("./gameRoom")
    , util = require('util');

/*
 The list of participants in our game (both observers and players).
 The format of each participant will be:
 {
 id: "sessionId",
 name: "participantName" (null for observers),
 isPlaying: true/false (true after the participant joins the game)
 status: "active"/"brb"
 }
 */
var participants = [];

/* Server config */

//Server's IP address
app.set("ipaddr", "leena-lemur-ultra.local");

//Server's port number 
app.set("port", 8080);

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

/* Socket.IO events */

io.on("connection", function(socket) {
    var sessionId = socket.id;
    //console.log(util.inspect(socket.id));
    //console.log("connected with id " + sessionId);
    console.log(util.inspect(gameRoom));
    socket.on('playerEvent', function(data) {
        //gameRoom.playerJoinsGameRoom(sessionId);
        gameRoom.respondToPlayerEvent(data);
    });
});

//Start the http server at port and IP defined before
http.listen(app.get("port"), app.get("ipaddr"), function() {
    console.log("Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
});

