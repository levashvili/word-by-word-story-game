/**
 * Created by leena on 10/23/13.
 */
//start server, which receives and emits web socket events
var server = require("./server");

var gameRoom = require("./gameRoom");
server.registerSocketEvents = gameRoom.registerEvents;
//get an instance of GameRoom, which is the state logic of the game


