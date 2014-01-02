define(['jquery', 'underscore', 'backbone'], function(jquery, _, Backbone) {
//   var WebSocketsEventsDispatcher = Backbone.Events.extend({
//
//   });
//
//   return WebSocketsEventsDispatcher;

    return {

        formatItem: function (count) {
            return (count === 1) ? "item" : "items";
        },

        delay: 100
    };
});

//define(function () {
//    return {
//
//        formatItem: function (count) {
//            return (count === 1) ? "item" : "items";
//        },
//
//        delay: 100
//    };
//});

function init() {

    var serverBaseUrl = document.domain;
    var isMyTurn = false;
    console.log("server domain: " + document.domain);
    /*
     On client init, try to connect to the socket.IO server.
     Note we don't specify a port since we set up our server
     to run on port 8080
     */
    console.log(document.domain);
    var socket = io.connect(serverBaseUrl);

    //We'll save our session ID in a variable for later
    var sessionId = '';

    //Helper function to update the participants' list
    function updatePlayers(players) {
        $('#players').html('');
        for (var i = 0; i < players.length; i++) {
            $('#players').append('<span id="' + players[i].id + '">' +
                players[i].name + ' ' + (players[i].id === sessionId ? '(You)' : '') +
                (players[i].isOnBreak ? '(brb)' : '') + '<br /></span>');
        }
    }
    //Helper function to update whose turn it is
    function updateTurn(gameTurnPlayerId) {

        if( (gameTurnPlayerId === sessionId) && !isMyTurn) {
            console.log("showing word text field");
            $('#word').show();
            $('#submit-word').show();
            isMyTurn = true;
        } else if((gameTurnPlayerId !== sessionId) && isMyTurn) {
            console.log("hiding word text field");
            $('#word').hide();
            $('#submit-word').hide();
            isMyTurn = false;
        } else {
            //do nothing
        }
        console.log('updating turn for next player');
    }

    function updateStory(storyText) {
        $('#story-text').text(storyText);
    }
    /*On

     /*
     When the client successfully connects to the server, an
     event "connect" is emitted. Let's get the session ID and
     log it. Also, let the socket.IO server know there's a new user
     with a session ID. We'll emit the "newUser" event
     for that.
     */
    socket.on('connect', function () {
        sessionId = socket.socket.sessionid;
        //console.log('Connected ' + sessionId);
        //socket.emit('newUser', {id: sessionId});
        console.log('client connected with session id ' + sessionId);
    });
    /*

     */
    socket.on('beginPlaying', function (data) {
        console.log('begin  playing ');// + util.inspect(data));
        updatePlayers(data.players);
        updateStory(data.story);
        updateTurn(data.gameTurnPlayerId);
    });
    /*
     When the server emits the "newPlayerJoined" event, we'll reset
     the players section and display the participating players.
     Note we are assigning the sessionId as the span ID.
     */
    socket.on('newPlayerJoined', function (data) {
        //updatePlayers(data.players);
        console.log('new player joined game ' + data.id);
        updatePlayers(data.players);
        updateTurn(data.gameTurnPlayerId);
    });
    /*
     When the player is taking a break, update status of players
     */
    socket.on('playerTookBreak', function(data) {
        //updatePlayers(data.players);
        console.log('player taking a break ' + data.id);
        updatePlayers(data.players);
        updateTurn(data.gameTurnPlayerId)
    });
    /*
     When the player is back from the break, update status of players
     */
    socket.on('playerReturnedFromBreak', function(data) {
        //updatePlayers(data.players);
        console.log('player comes back from break ' + data.id);
        updatePlayers(data.players);
        updateTurn(data.gameTurnPlayerId);
    });
    /*
     When the server emits the "playerLeavesGame" event, we'll
     remove the span element from the participants element
     */
    socket.on('playerLeft', function(data) {
        //$('#' + data.id).remove();
        console.log('player leaves game ' + data.id);
        updatePlayers(data.players);
        updateTurn(data.gameTurnPlayerId);
    });
    /*
     When receiving a new word event,
     we'll prepend it to the story
     */
    socket.on('playerSubmittedWord', function (data) {
        updateStory(data.story);
        updatePlayers(data.players);
        updateTurn(data.gameTurnPlayerId);
        console.log('word submitted by a player ' + data.id);
    });
    /*
     Log an error if unable to connect to server
     */
    socket.on('error', function (reason) {
        console.log('Unable to connect to server', reason);
    });

    function joinGame(id, name) {
        socket.emit('playerEvent',
            {
                name: 'newPlayerJoins',
                data: {
                    id: id,
                    name:name
                }
            });
        console.log("emitted newPlayerJoins event");
    }

    /*UI item handlers*/
    function onJoinGameBtnClick() {
        var id = sessionId;
        var name = $('#name').val();
        joinGame(id, name);
    }

    function onNameKeyUp() {
        var nameValue = $('#name').val();
        $('#join-game').attr('disabled', (nameValue.trim()).length > 0 ? false : true);
    }

    function onWordKeyUp() {
        var wordValue = $('#word').val();
        $('#submit-word').attr('disabled', (wordValue.trim()).length > 0 ? false : true);
    }
    /*
     Allow Word submit on enter
     */
    function onWordKeyDown(event) {
        if (event.which == 13) {
            event.preventDefault();
            if ($('#word').val().trim().length <= 0) {
                return;
            }
            var word = $('#word').val();
            socket.emit('playerEvent', {
                name: 'playerSubmitsWord',
                data: {
                    word: word,
                    id: sessionId
                }
            });
        }
    }

    function onSubmitWordBtnClick() {
        var word = $('#word').val();
        socket.emit('playerEvent', {
            name: 'playerSubmitsWord',
            data: {
                word: word,
                id: sessionId
            }
        });
    }

    function onRequestBreakBtnClick() {
        socket.emit('playerEvent', {
            name: 'playerTakesBreak',
            data: {
                id: sessionId
            }
        });
    }

    function onReturnFromBreakBtnClick() {
        socket.emit('playerEvent', {
            name: 'playerReturnsFromBreak',
            data: {
                id: sessionId
            }
        });
    }
    /* Elements setup */
    $('#name').on('keyup', onNameKeyUp);
    $('#word').on('keyup', onWordKeyUp);
    $('#word').on('keydown', onWordKeyDown);
    /*When user presses the 'Join Game' button, emit the  event to the server.*/
    $('#join-game').on('click', onJoinGameBtnClick);

    /*When user submits the word, emit the event to the server*/
    $('#submit-word').on('click', onSubmitWordBtnClick);

    /*when player wants to take a break, emit the event*/
    $('#be-right-back').on('click', onRequestBreakBtnClick);

    /*When player comes back from break, emit event*/
    $('#back-from-break').on('click', onReturnFromBreakBtnClick);
}

$(document).on('ready', init);