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
            this.gameRoomEvents.on('gameRoom:playerJoined', this.addPlayer.bind(this));
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

        addPlayer: function(obj) {
            this.add({
                name: obj.name
            })
        }

    });

    return PlayersCollection;
});
