define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/game-room.html',
    'text!templates/text-area.html'
], function($, _, Backbone, GameRoomTemplate, TextAreaTemplate){
    var TextAreaView = Backbone.View.extend({

        textAreaAttributes : {
            storyText: 'Default story text goes here.',
            placeholder: 'Default placeholder goes here.'
        },

        id: 1,

        tagName: 'div',

        className: '.container',

        attributes: {

        },

        template: _.template(TextAreaTemplate, this.textAreaAttributes),

        events: {
            'keyup #new-text': 'newTextSpanKeyPress',
            //'click #new-text': 'newTextSpanKeyPress',
            'hover #new-text': 'newTextSpanKeyPress',
            'click #join-game': 'joinGame',
            'click #quit-game': 'quitGame',
            'click #be-right-back': 'beRightBack',
            'click #back-from-break': 'backFromBreak',
            'keypress .edit': 'updateOnEnter',
            'blur .edit': 'close'
        },

        initialize: function () {
//            this.listenTo(this.model, 'change', this.render);
//            this.listenTo(this.model, 'destroy', this.remove);
//            this.listenTo(this.model, 'visible', this.toggleVisible);
        },


        render: function () {
            //this.$el.html(GameRoomTemplate);
            //$("#text-area").html(_.template(TextAreaTemplate, this.textAreaAttributes));
            this.$el.html(_.template(TextAreaTemplate, this.textAreaAttributes));
            return this;
        },

        newTextSpanKeyPress: function(event) {
            //e.Key == Key.Return && (e.Key == Key.LeftCtrl || e.Key == Key.RightCtrl)
            console.log('logging event occurrence');
            if(event.ctrlKey && event.keyCode === 13) {
                console.log('you pressed control + enter');
            }
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
    return TextAreaView;
});
