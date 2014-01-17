define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/story-editor-toolbar.html'
], function($, _, Backbone, StoryEditorTemplate){

    var View = Backbone.View.extend({

        template: _.template(StoryEditorTemplate),

        //gameRoomEvents: _.extend({}, Backbone.Events),

        initialize: function (obj) {
            _(this).extend(obj);
        },

        render: function () {
            this.$el.hide();
            this.$el.html(this.template({}));
            this.newParagraphButton = $(this.$el.find("#new-paragraph")[0]);
            this.playPauseButton = $(this.$el.find("#play-pause")[0]);
            this.enterNameInput = $(this.$el.find("#enter-name-input")[0]);
            this.enterNameForm = $(this.$el.find('#enter-name')[0]);

            this.newParagraphButton.on('click', this.addNewParagraph.bind(this));
            this.playPauseButton.on('click', this.playPause.bind(this));
            this.playPauseButton.isPlay = true;
            this.playPauseButton.makePlay = function() {
                $(this.find("span")[0]).removeClass("glyphicon-pause").addClass("glyphicon-play");
                this.isPlay = true;
            };
            this.playPauseButton.makePause = function() {
                $(this.find("span")[0]).removeClass("glyphicon-play").addClass("glyphicon-pause");
                this.isPlay = false;
            };

            this.enterNameInput.on('blur', this.hideEnterName.bind(this));
            this.enterNameInput.on('keydown', this.joinGame.bind(this));

            this.$el.show();
            return this;
        },

        addNewParagraph: function() {

            this.model.addParagraph({
                editableText: '',
                placeholder: 'Start typing here...'
            });
        },

        playPause: function() {
            if(this.playPauseButton.isPlay) {
                this.enterNameForm.slideToggle('fast');
                this.enterNameForm.removeClass("hidden");
                this.enterNameInput.focus();
            } else {
                this.playPauseButton.makePlay();
            }

        },

        hideEnterName: function() {
            this.enterNameForm.hide('slow');
            //this.$el.find('#enter-name')[0].classList.add("hidden");
        },

        joinGame: function(event) {
            var playerName = this.enterNameInput.val();
            if(event.which == 13 && playerName !== "") {
                this.playPauseButton.makePause();
                this.hideEnterName();
                this.gameRoomEvents.trigger('gameRoom:playerJoined', {
                    name: playerName
                });
            }
        }

    });

    return View;
});
