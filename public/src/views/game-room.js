define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/game-room.html',
    'text!templates/text-area.html'
], function($, _, Backbone, GameRoomTemplate, TextAreaTemplate){
    var GameRoomView = Backbone.View.extend({
        //... is a list tag.
        //tagName:  'li',
        el: $("#game-room"),

        template: GameRoomTemplate,
        // Cache the template function for a single item.
        //template: _.template($('#item-template').html()),

        // The DOM events specific to an item.
        events: {
            'click #join-game': 'joinGame',
            'click #quit-game': 'quitGame',
            'click #be-right-back': 'beRightBack',
            'click #back-from-break': 'backFromBreak',
            'keypress .edit': 'updateOnEnter',
            'blur .edit': 'close'
        },

        // The TodoView listens for changes to its model, re-rendering. Since there's
        // a one-to-one correspondence between a **Todo** and a **TodoView** in this
        // app, we set a direct reference on the model for convenience.
        initialize: function () {
//            this.listenTo(this.model, 'change', this.render);
//            this.listenTo(this.model, 'destroy', this.remove);
//            this.listenTo(this.model, 'visible', this.toggleVisible);
        },

        // Re-render the titles of the todo item.
        render: function () {
//            this.$el.html(this.template(this.model.toJSON()));
//            this.$el.toggleClass('completed', this.model.get('completed'));
//            this.toggleVisible();
//            this.$input = this.$('.edit');
//            return this;

            this.$el.html(GameRoomTemplate);
            $("#text-area").html(_.template(TextAreaTemplate, {
                storyText: 'Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. <br>Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. Some html go here. <br>',
                placeholder: 'Start typing here...'
            }));
            return this;
        },

        joinGame: function() {
            //alert('hi! join please');
            console.log('hi');
        },

        quitGame: function() {
            //alert('hi, please don\'t go away!!!');
            console.log('hi');
        },

        beRightBack: function() {
            alert('come back soon!!!');
        },

        backFromBreak: function() {
            alert('welcome back!!!');
        }

    });
    return GameRoomView;
});
