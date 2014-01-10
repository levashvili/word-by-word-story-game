define([
    'jquery',
    'underscore',
    'backbone',
    'views/story/story-title',
    'views/story/story-text'
], function($, _, Backbone, StoryTitleView, StoryTextView){

    var View = Backbone.View.extend({

        className: 'panel',

        initialize: function () {
            this.children = {
                storyTitle: new StoryTitleView({model: this.model}),
                storyText: new StoryTextView({model: this.model})
            };
        this.$el.hide();
        this.$el.append(this.children.storyTitle.render().el);
        this.$el.append(this.children.storyText.render().el);

        },

        render: function () {
            this.$el.show();
            return this;
        }

    });

    return View;
});
