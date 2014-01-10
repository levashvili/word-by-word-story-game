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
            this.$el.show();
            return this;
        }

    });

    return View;
});
