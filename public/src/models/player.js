define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    var Player = Backbone.Model.extend({

        defaults: {
            "id": null,
            "name":  "",
            "isOnBreak": false,
            "age":     null,
            "gender":    null
        },
        constructor: function() {
            //this.name = name;
            Backbone.Model.apply(this, arguments);
        }
    });
    return Player;
});