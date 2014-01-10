define([
    'underscore',
    'backbone',
    'localStorage'
], function(_, Backbone, Store) {

    var store = new Store(window.store || "Story"); // for testing purposes

    var Story = Backbone.Model.extend({

        localStorage: store,

        customEvents: _.extend({}, Backbone.Events),

        defaults: {
            title: "",
            paragraphs: [],
            editableContent: [],
            timestamp: 0,
            completed: false
        },

        initialize: function(attr, opt) {
            //Backbone.Model.apply(this, arguments);
            _(this).extend(opt);
            this.customEvents.on('story:addParagraph', this.addParagraph.bind(this));
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

        addParagraph: function(paragraphText) {
            if($.trim(_(this.attributes.paragraphs).last()) === '') {
                this.attributes.paragraphs.pop();
            }

            if(paragraphText && typeof(paragraphText) == 'string') {
                this.attributes.paragraphs.push(paragraphText);
            } else {
                this.attributes.paragraphs.push('');
            }
        }

    });

    return Story;
});