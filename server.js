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
    , _ = require("underscore");

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
io.on("connection", function(socket){

    /*
     When a new user connects to our server, we expect an event called "newUser"
     and then we'll emit an event called "beginObservingGame" to the new user
     with the story text and a list of all players.
     */
    socket.on("newUser", function(data) {
        participants.push({id: data.id, name: "", isPlaying: false, status:"active"});
        console.log("received newUser request with id: " + data.id);
        socket.emit('beginObservingGame', {storyText: "Sample story text from the server", players: getPlayers()});
        //io.sockets.emit("newConnection", {participants: participants});
    });

    socket.on('playerJoinsGame', function(data) {
        console.log('player joins game');
        //emit begin playing event
        socket.emit('beginPlaying', {});
    });

    socket.on('playerSubmitsWord', function(data) {
        console.log('player submits word');
        //send the word to everybody observing or playing game
        io.sockets.emit('incomingWord', { word: data.word, id: data.id });
    });

    socket.on('playerRequestsBreak', function(data) {
        console.log('player requests break');
        //remove player from active players queue
        //notify everyone involved that player is on break
        io.sockets.emit('playerTakingBreak', {players: getPlayers()});
    });

    socket.on('playerReturnsFromBreak', function(data) {
        console.log('player back from break');
        io.sockets.emit('playerReturningFromBreak', {players: getPlayers()});
    });
    /*
     When a client disconnects from the server, the event "disconnect" is automatically
     captured by the server. It will then emit an event called "userDisconnected" to
     all participants with the id of the client that disconnected
     */
    socket.on("disconnect", function() {
        participants = _.without(participants,_.findWhere(participants, {id: socket.id}));
        io.sockets.emit("playerLeavesGame", {id: socket.id, sender:"system"});
    });
});
//Helper functions
//returns a list of players only
function getPlayers(participants) {
    return [
     {
       id: "1000",
       name: "Jonathan",
       status: ""
     },
     {
       id: "2000",
       name: "Emory",
       status: "brb"
    }
    ];
}
//Start the http server at port and IP defined before
http.listen(app.get("port"), app.get("ipaddr"), function() {
    console.log("Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
});
