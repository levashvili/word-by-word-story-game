define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/story-circles.html'
], function($, _, Backbone, StoryCirclesTemplate){

    var View = Backbone.View.extend({

        tagName: "div",

        className: "center-block",

        id: "story-circles-view",

        template: _.template(StoryCirclesTemplate),

        events: {
            'click a': function(event) {
                this.enterStoryCircle(event)
            }
        },

        initialize: function (obj) {
            _(this).extend(obj);
            this.collection.on('add', this.render.bind(this));
            this.collection.on('reset', this.render.bind(this));
        },

        render: function () {
            this.$el.hide();
            this.$el.html(this.template({
                storyCircles: this.collection.models
            }));
            this.$el.show();
            return this;
        },

        enterStoryCircle: function(event) {
//            event.currentTarget.id;
            this.masterView.openStoryEditorView();
            this.socketEvents.enterStoryCircle(event.currentTarget.id);
        }
    });

    return View;
});
