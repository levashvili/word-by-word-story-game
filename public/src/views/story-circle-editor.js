define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/story-circle-editor.html'
], function($, _, Backbone, StoryEditorTemplate){

    var View = Backbone.View.extend({

        id: 'story-circle-editor-view',

        className: 'center-block',

        template: _.template(StoryEditorTemplate),

        initialize: function (obj) {
            _(this).extend(obj);
            this.collection.on('reset', this.render.bind(this));
            this.model.on('change', this.render.bind(this));
        },

        render: function () {
            this.$el.hide();
            this.$el.html(this.template({}));
            this.$el.show();
            return this;
        }
    });

    return View;
});
