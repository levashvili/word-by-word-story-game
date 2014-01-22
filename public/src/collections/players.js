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

        avatarId: null,

        initialize: function(models, obj) {
            _(this).extend(obj);
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

        myAvatar: function() {
            return this.get(this.avatarId);
        },

        setAvatarId: function(id) {
            this.avatarId = id;
        },

        getAvatarId: function() {
            return this.avatarId;
        }
    });

    return PlayersCollection;
});
