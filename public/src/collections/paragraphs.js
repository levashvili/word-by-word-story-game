define([
    'jquery',
    'underscore',
    'localStorage',
    'models/paragraph'
], function($, _, Store, Paragraph) {

    var store = new Store(window.store || "Paragraphs"); // for testing purposes

    var Paragraphs = Backbone.Collection.extend({

        localStorage: store,

        model: Paragraph,

        unEditable: function() {
            return this.where({editableText: undefined});
        },

        editable: function() {
            return this.where({editable: /^$|\s+/ });
        },

        comparator: function(model){
            return model.get('number');
        }
    });

    return Paragraphs;
});