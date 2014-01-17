define([
    'underscore',
    'backbone',
    'localStorage',
    'models/player'
], function(_, Backbone, Store, Player){
    var PlayersCollection = Backbone.Collection.extend({
        // Reference to this collection's model.
        model: Player,

        //gameRoomEvents: _.extend({}, Backbone.Events),
        // Save all of the player items under the `"player"` namespace.
        localStorage: new Backbone.LocalStorage('players-backbone'),

        initialize: function(models, obj) {
            _(this).extend(obj);
            this.gameRoomEvents.on('gameRoom:playerJoined', this.resetPlayers.bind(this));
            this.gameRoomEvents.on('players:resetPlayers', this.resetPlayers.bind(this));
            this.gameRoomEvents.on('players:addPlayer', this.addPlayer.bind(this));
            this.gameRoomEvents.on('players:removePlayer', this.removePlayer.bind(this));
        },

        nextOrder: function () {
            if (!this.length) {
                return 1;
            }
            return this.last().get('order') + 1;
        },

        // Players are sorted by their original insertion order.
        comparator: function (player) {
            return player.get('order');
        },

        resetPlayers: function(players) {
//            for (var i = 0; i < players.length; i++) {
//                $('#players').append('<span id="' + players[i].id + '">' +
//                    players[i].name + ' ' + (players[i].id === sessionId ? '(You)' : '') +
//                    (players[i].isOnBreak ? '(brb)' : '') + '<br /></span>');
//
//
//            }
            this.reset(players);
        },

        addPlayer: function(player) {
            this.add(player);
        },

        removePlayer: function(player) {
            this.remove(player);
        }

    });

    return PlayersCollection;
});
