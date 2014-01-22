define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    var Player = Backbone.Model.extend({

        defaults: {
            "id": null,
            "name":  "Default Name",
            "takingBreak": false,
            "gameTurn": false
        },
        constructor: function() {
            //this.name = name;
            Backbone.Model.apply(this, arguments);
        },

        validate: function(attributes, options) {
            if(typeof attributes.name != "string" || attributes.name == "") {
                return "player name must be a non-empty string";
            }
        },

        url: function() {
            return "players/" + this.attributes.id;
        }
    });
    return Player;
});