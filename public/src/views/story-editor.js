define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/story-editor.html',
    'views/story-editor-toolbar',
    'models/player'
], function($, _, Backbone, StoryEditorTemplate, StoryEditorToolbar, Player){

    var View = Backbone.View.extend({

        tagName: 'div',

        className: 'panel panel-default',

        template: _.template(StoryEditorTemplate),

        gameTurn: false,

        initialize: function (obj) {
            _(this).extend(obj);

            this.children = {
                storyEditorToolbar: new StoryEditorToolbar({
                    collection: this.collection,
                    gameRoomEvents: this.gameRoomEvents,
                    socketEvents: this.socketEvents
                })
            };
            this.$el.hide();
            this.collection.on('reset', function() {
                var avatar = this.collection.get(this.collection.getAvatarId());
                this.prevGameTurnState = this.gameTurn;
                if(avatar && avatar.get('gameTurn')) {
                    this.gameTurn = true;
                } else {
                    this.gameTurn = false;
                }
                if(this.prevGameTurnState != this.gameTurn) {
                    this.render();
                }
                //this.render();
            }, this);
            this.model.on('change:text', function() {
                this.render();
            }, this);
        },

        render: function () {
            this.$el.html(this.template({
                title: this.model.get('title'),
                text: this.model.get('text'),
                gameTurn: this.gameTurn
            }));
            this.$el.find('#story-toolbar')[0].appendChild(this.children.storyEditorToolbar.render().el);
            this.editableSpan = $(this.$el.find('#editable-span')[0]);
            this.editableSpan.focus();
            this.editableSpan.on('keydown', this.submitText.bind(this));
            this.$el.show();
            return this;
        },

        submitText: function(event) {
            var text = this.editableSpan.html();
            if(event.which == 13 && text !== "") {
                event.preventDefault();
                this.socketEvents.submitText(text);
            }
        }

    });

    return View;
});
