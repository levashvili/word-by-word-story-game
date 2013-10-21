/**
 * Created by leena on 10/10/13.
 */
var players;

function addPlayer() {
    players = ++players || 1;
}

function removePlayer() {

}

function getNextPlayer() {

}

function getTotalPlayers() {
    return players;
}

exports.addPlayer = addPlayer;
exports.removePlayer = removePlayer;
exports.getNextPlayer = getNextPlayer;
exports.getTotalPlayers = getTotalPlayers;

