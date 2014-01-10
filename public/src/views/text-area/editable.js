define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

    var View = Backbone.View.extend({

        tagName: 'span',

        attributes: {
            contenteditable: true
        },

        initialize: function () {

        },

        render: function () {
            this.$el.html(this.model.attributes.editableText);
            this.$el.show();
            return this;
        }

    });

    return View;
});
