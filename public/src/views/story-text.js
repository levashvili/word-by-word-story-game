define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/story-editor.html'
], function($, _, Backbone, StoryEditorTemplate){

    var View = Backbone.View.extend({

        template: _.template(StoryEditorTemplate),

        initialize: function () {


        },

        render: function () {
            this.$el.hide();
            _.each(this.model.attributes.paragraphs, function(paragraph) {
                this.$el.append('<p>');
            }.bind(this));
            this.$el.show();
            return this;
        }

    });

    return View;
});
