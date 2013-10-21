function init() {

    var serverBaseUrl = document.domain;
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
                (players[i].status === 'brb' ? '(brb)' : '') + '<br /></span>');
        }
    }
    //Helper function to update whose turn it is
    function updateTurn(playerId) {
        if(playerId === sessionId) {
            $('#story-text').html($('#story-text').val() +
                "<span><input type=\"textarea\" rows=\"1\" cols=\"30\" id=\"word\" /></span>");
        }
        console.log('updating turn for next player');
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
        console.log('Connected ' + sessionId);
        socket.emit('newUser', {id: sessionId});
    });
    /*
     Server provides information on the game in progress
     */
    socket.on('beginObservingGame', function(data) {
        //update story text
        $('story-text').val(data.storyText);
        //update list of players
        updatePlayers(data.players);
        console.log('began observing game');
    });
    /*
     When the server sends beginPlaying event
     */
    socket.on('beginPlaying', function(data) {
        //do whatever needs to be done to begin playing
        //updatePlayers(data.players);
        console.log('began playing');
    });
    /*
     When the server emits the "newPlayerJoinsGame" event, we'll reset
     the players section and display the participating players.
     Note we are assigning the sessionId as the span ID.
     */
    socket.on('newPlayerJoinsGame', function (data) {
        updatePlayers(data.players);
        console.log('new player joined game');
    });

    /*
     When the player is taking a break, update status of players
     */
    socket.on('playerTakingBreak', function(data) {
        updatePlayers(data.players);
        console.log('player taking a break');
    });
    /*
     When the player is back from the break, update status of players
     */
    socket.on('playerReturningFromBreak', function(data) {
        updatePlayers(data.players);
        console.log('player comes back from break');
    });
    /*
     When the server emits the "playerLeavesGame" event, we'll
     remove the span element from the participants element
     */
    socket.on('playerLeavesGame', function(data) {
        $('#' + data.id).remove();
        console.log('player leaves game');
    });

    /*
     When receiving a new word event,
     we'll prepend it to the story
     */
    socket.on('incomingWord', function (data) {
        var word = data.word;
        $('#story-text').append(' ' + word + ' ');
        //update turn
        updateTurn(data.id);
        console.log('word submitted by a player');
    });
    /*
     Log an error if unable to connect to server
     */
    socket.on('error', function (reason) {
        console.log('Unable to connect to server', reason);
    });

    /*
    Helper function to disable/enable Join Game button
     */
    function nameKeyUp() {
        var nameValue = $('#name').val();
        $('#join-game').attr('disabled', (nameValue.trim()).length > 0 ? false : true);
    }
    /*
    Helper function to enable/disable Submit Word button
    */
    function wordKeyUp() {
        var wordValue = $('#word').val();
        $('#submit-word').attr('disabled', (wordValue.trim()).length > 0 ? false : true);
    }
    /*
    Allow Word submit on enter
     */
    function wordKeyDown(event) {
        if (event.which == 13) {
            event.preventDefault();
            if ($('#word').val().trim().length <= 0) {
                return;
            }
            var word = $('#word').val();
            socket.emit('playerSubmitsWord', { word: word, id: sessionId });
        }
    }

    function joinGame() {
        socket.emit('playerJoinsGame', { id: sessionId });
    }

    function submitWord() {
        var word = $('#word').val();
        socket.emit('playerSubmitsWord', { word: word, id: sessionId });
    }

    function requestBreak() {
        socket.emit('playerRequestsBreak', { id: sessionId });
    }

    function returnFromBreak() {
        socket.emit('playerReturnsFromBreak', {id: sessionId });
    }
    /* Elements setup */
    $('#name').on('keyup', nameKeyUp);
    $('#word').on('keyup', wordKeyUp);
    /*When user presses the 'Join Game' button, emit the  event to the server.*/
    $('#join-game').on('click', joinGame);

    /*When user submits the word, emit the event to the server*/
    $('#submit-word').on('click', submitWord);

    /*when player wants to take a break, emit the event*/
    $('#be-right-back').on('click', requestBreak);

    /*When player comes back from break, emit event*/
    $('#back-from-break').on('click', returnFromBreak);
}

$(document).on('ready', init);