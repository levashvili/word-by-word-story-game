define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/story-circle-editor.html',
    'models/player'
], function($, _, Backbone, StoryEditorTemplate, Player){

    var View = Backbone.View.extend({

        id: 'story-circle-editor-view',

        className: 'center-block',

        template: _.template(StoryEditorTemplate),

        initialize: function (obj) {
            _(this).extend(obj);

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
