define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/story-editor-toolbar.html',
    'models/player'
], function($, _, Backbone, StoryEditorTemplate, Player){

    var View = Backbone.View.extend({

        template: _.template(StoryEditorTemplate),

        model: new Player(),

        initialize: function (obj) {
            _(this).extend(obj);
            this.collection.on('reset', function() {
                this.model = this.collection.myAvatar();
                if(!this.model) {
                    this.model = new Player();
                }
                this.render();
            }.bind(this));
        },

        render: function () {
            this.$el.hide();
            this.$el.html(this.template(this.model.toJSON()));

            this.newParagraphButton = $(this.$el.find("#new-paragraph")[0]);
            this.playPauseButton = $(this.$el.find("#play-pause")[0]);
            this.enterNameInput = $(this.$el.find("#enter-name-input")[0]);
            this.newParagraphButton.on('click', this.addNewParagraph.bind(this));

            this.playPauseButton.on('click', this.playPause.bind(this));
            this.enterNameInput.on('keydown', this.joinGame.bind(this));

            this.$el.show();
            return this;
        },

        addNewParagraph: function() {

        },

        playPause: function() {
            var takingBreak = (this.model.attributes.takingBreak) ? false : true;

            if(takingBreak) {
                this.socketEvents.takeBreak();
            } else {
                this.socketEvents.returnFromBreak();
            }
        },

        joinGame: function(event) {
            var playerName = this.enterNameInput.val();
            if(event.which == 13 && playerName !== "") {

                this.socketEvents.joinGame(playerName);
            }
        }
    });

    return View;
});
