define([
    'underscore',
    'backbone',
    'webSocketsStorage'
], function(_, Backbone, Store) {

//    var store = new Store(window.store || "StoryCircle"); // for testing purposes

    var StoryCircle = Backbone.Model.extend({

//        webSocketsStorage: store,

        customEvents: _.extend({}, Backbone.Events),

        defaults: {
            id: null,
            playerName: "",
            storyCircleName: "",
            maxNumPlayers: 6
        },

        initialize: function(attr, opt) {
            _(this).extend(opt);
        },

        validate: function() {
            if(this.playerName === "") {
                return 'invalid player name';
            }
            if(this.storyCircleName === "") {
                return 'invalid story circle name';
            }
            if(typeof this.maxNumPlayers != "number" || this.maxNumPlayers < 2 || this.maxNumPlayers > 6) {
                return 'invalid max number of players';
            }
        }

    });

    return StoryCircle;
});