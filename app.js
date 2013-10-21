/**
 * Created by leena on 10/9/13.
 */
var server = require("./server");
var gameRoom = require("./gameRoom");

function sleep(milliSeconds) {
    var start = new Date().getTime();
    while(new Date().getTime() < start + milliSeconds) {

    }
}

//hook up all the events
function onSocketConnection(socket) {


    gameRoom.addPlayer();
    console.log("Client connected: " + socket.id);
    console.log("Total number of players is: " + gameRoom.getTotalPlayers() );
}

server.start(onSocketConnection);


