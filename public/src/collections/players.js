define([
    'underscore',
    'backbone',
    'localStorage',
    'models/player'
], function(_, Backbone, Store, Player){
    var PlayersCollection = Backbone.Collection.extend({
        // Reference to this collection's model.
        model: Player,

        // Save all of the player items under the `"playes"` namespace.
        localStorage: new Backbone.LocalStorage('players-backbone'),

//        // Filter down the list of all todo items that are finished.
//        completed: function () {
//            return this.filter(function (todo) {
//                return todo.get('completed');
//            });
//        },
//
//        // Filter down the list to only todo items that are still not finished.
//        remaining: function () {
//            return this.without.apply(this, this.completed());
//        },

        // We keep the Players in sequential order, despite being saved by unordered
        // GUID in the database. This generates the next order number for new items.
        nextOrder: function () {
            if (!this.length) {
                return 1;
            }
            return this.last().get('order') + 1;
        },

        // Players are sorted by their original insertion order.
        comparator: function (player) {
            return player.get('order');
        }

    });

    return PlayersCollection;
});
