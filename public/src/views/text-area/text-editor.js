define(['backbone', 'underscore'], function(Backbone, _) {

    //var template = _.template(this.contentText);

    var TextEditorView = Backbone.View.extend({
        tagName: 'span',

        id: 'text-editor',

        customEvents: _.extend({}, Backbone.Events),

        parentEl: $('#text-area'),

        contentText: '2.enter text here',

        template: function() {return this.contentText},

        attributes: {
            contenteditable: true
        },

        initialize: function(obj){
            _(this).extend(obj);
            this.customEvents.on('game-room:entryReceived', this.stopEditing.bind(this));
        },

        stopEditing: function() {
            this.attributes.contenteditable = false;
        },

        isEditable: function() {
            return this.attributes.contenteditable;
        },

        render: function() {
            this.$el.show().html( this.template({}) );
            this.parentEl.html(this.el);
            this.$el.focus();
            //this.$el.blur();
            return this;
        },
        events: {
            //ui events
            keydown: function(event) {
                if(event.which == 13) { //submit on enter
                    event.preventDefault();

//                    this.trigger('text-editor:submit', {
//                        text: this.getText()
//                    });
                    this.customEvents.trigger('text-editor:submit', {
                        text: this.getText()
                    });
                }
            }
        },

        getId: function() {
            return this.id;
        },

        getText: function() {
            return this.$el.html();
        }
    });

    return TextEditorView;
});