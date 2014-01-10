define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/story-editor.html',
    'views/story-text',
    'views/story-editor-toolbar'
], function($, _, Backbone, StoryEditorTemplate, StoryTextView, StoryEditorToolbar){

    var View = Backbone.View.extend({

        template: _.template(StoryEditorTemplate),

        initialize: function () {

            this.listenTo(this.model, 'change', this.render);

            this.children = {
                //storyTextView: new StoryTextView({model: this.model}),
                storyEditorToolbar: new StoryEditorToolbar({model: this.model})
            };
            this.$el.hide();
            //this.$el.append(this.children.storyTextView.render().el);
            //this.$el.append(this.children.storyEditorToolbar.render().el);

        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            //this.$el.find('#story-text')[0].appendChild(this.children.storyTextView.render().el);
            this.$el.find('#story-toolbar')[0].appendChild(this.children.storyEditorToolbar.render().el);
            //this.$el.children('#story-text').appendChild(this.children.storyTextView.el);
            this.$el.show();
            return this;
        }

    });

    return View;
});
