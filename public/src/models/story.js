define([
    'underscore',
    'backbone',
    'localStorage',
    'collections/paragraphs'
], function(_, Backbone, Store, ParagraphsCollection) {

    var store = new Store(window.store || "Story"); // for testing purposes

    var Story = Backbone.Model.extend({

        localStorage: store,

        customEvents: _.extend({}, Backbone.Events),

        defaults: {
            title: "",
            text: "",
            paragraphs: new ParagraphsCollection(),
            editableContent: [],
            timestamp: 0,
            completed: false
        },

        initialize: function(attr, opt) {
            //Backbone.Model.apply(this, arguments);
            _(this).extend(opt);
            this.on('story:addParagraph', this.addParagraph.bind(this));
        },

        getParagraphs: function() {
            return this.attributes.paragraphs;
        },

        getParagraphAt: function(key) {
            if( typeof(key) == 'number' && key > 0 && key <= this.attributes.paragraphs.length ) {
                return this.attributes.paragraphs[key-1];
            } else {
                return null;
            }
        },

        numberOfParagraphs: function() {
            return this.attributes.paragraphs.length;
        },

        addParagraph: function(obj) {
            this.attributes.paragraphs.add({
                number: this.attributes.paragraphs.length + 1,
                placeholder: 'Start typing here...'
            });
            this.trigger('change:paragraphs');
        },

        setEditableText: function(paragraphNum, text) {
            var paragraphs = this.getParagraphs();
            paragraphs[paragraphNum - 1].editableText = text;
            this.set("paragraphs", paragraphs);
        },

        setPlaceholder: function(paragraphNum, text) {
            var paragraphs = this.getParagraphs();
            paragraphs[paragraphNum - 1].placeholder = text;
            this.set("paragraphs", paragraphs);
        }
    });

    return Story;
});