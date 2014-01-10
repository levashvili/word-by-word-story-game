define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/story-editor-toolbar.html'
], function($, _, Backbone, StoryEditorTemplate){

    var View = Backbone.View.extend({

        template: _.template(StoryEditorTemplate),

        events: {
            'click #new-paragraph': 'addNewParagraph'
        },

        initialize: function () {
            //this.listenTo(this.model, 'change', this.render);

        },

        render: function () {
            this.$el.html(this.template({}));
            this.$el.show();
            return this;
        },

        addNewParagraph: function() {
            this.model.trigger('story:addParagraph');
        }

    });

    return View;
});
