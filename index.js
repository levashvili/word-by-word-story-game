/**
 * Created by leena on 10/9/13.
 */
var http = require("http");
var socketsIO = require("socket.io");

var onRequest = function(req, res) {
    res.writeHead("200 OK");
    res.write("Response");
    res.end();
}
http.createServer(onRequest).listen(8888);