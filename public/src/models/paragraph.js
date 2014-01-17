define([
    'underscore',
    'backbone'
], function(_, Backbone) {

    var Paragraph = Backbone.Model.extend({

        //customEvents: _.extend({}, Backbone.Events),

        defaults: {
            number: null,
            unEditableText: "",
            editableText: "",
            placeholder: ""
        },

        initialize: function(attr, opt) {
            //Backbone.Model.apply(this, arguments);
            //_(this).extend(opt);
            //this.on('story:addParagraph', this.addParagraph.bind(this));
        }
    });

    return Paragraph;
});