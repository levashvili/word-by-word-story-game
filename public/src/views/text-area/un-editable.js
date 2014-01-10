define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

    var View = Backbone.View.extend({

        tagName: 'span',

        attributes: {
            contenteditable: false
        },

        initialize: function () {

        },

        render: function () {
            this.$el.html(this.model.attributes.unEditableText);
            this.$el.show();
            return this;
        }

    });

    return View;
});
