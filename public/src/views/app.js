define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    //'collections/todos',
    //'views/todos',
    //'text!templates/app.html',
    //'text!templates/game-controls-toolbar.html',
    'text!templates/app.html',
    'views/game-room'
], function($, _, Backbone, Bootstrap, AppTemplate, GameRoomView){
    var AppView = Backbone.View.extend({

        el: $("#collaborative_storytelling_app"),

        template: AppTemplate,

        events: {
            "click .icon":          "open",
            "click .button.edit":   "openEditDialog",
            "click .button.delete": "destroy"
        },

        initialize: function() {
            //this.listenTo(this.model, "change", this.render);
        },

        render: function() {
            //this.$('#nav_section').html(this.template);
            var game_room_view = new GameRoomView({el: $('#game-room')});
            game_room_view.render()
            //this.$('#collaborative_storytelling_app').html(AppTemplate);
            //this.$('#controls').html(GameControlsTemplate);
        }
    });

    return AppView;
});