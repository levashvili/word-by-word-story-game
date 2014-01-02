define(['backbone', 'underscore'], function(Backbone, _) {

    var StoryTextAreaView = Backbone.View.extend({

        tagName: 'span',

        customEvents: _.extend({}, Backbone.Events),

        parentEl: $('#text-area'),

        contentText: '2.enter text here',

        template: function() {return this.contentText},

        attributes: {
            contenteditable: true
        },

        initialize: function(obj){
            _(this).extend(obj);
            this.customEvents.on('story-text-area:stopEditing', this.stopEditing.bind(this));
            this.customEvents.on('story-text-area:startEditing', this.startEditing.bind(this));
            this.customEvents.on('story-text-area:emptyContents', this.emptyContents.bind(this));
            this.customEvents.on('story-text-area:setContents', this.setContents.bind(this));
            this.customEvents.on('story-text-area:appendContents', this.appendContents.bind(this));
            this.customEvents.on('story-text-area:focus', this.focus.bind(this));

        },

        stopEditing: function() {
            this.attributes.contenteditable = false;
        },

        startEditing: function() {
            this.attributes.contenteditable = true;
        },

        emptyContents: function() {
            this.$el.html("");
        },

        setContents: function(contents) {
            this.$el.html(contents);
        },

        getContents: function() {
            return this.$el.html();
        },

        appendContents: function(contentsToAppend) {
            this.$el.html(this.$el.html() + contentsToAppend);
        },

        isEditable: function() {
            return this.attributes.contenteditable;
        },

        focus: function() {
            this.$el.focus();
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
                        text: this.getContents()
                    });
                }
            }
        },

        getId: function() {
            return this.id;
        }
    });

    return StoryTextAreaView;
});