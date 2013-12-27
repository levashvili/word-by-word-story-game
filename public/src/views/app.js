define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    //'collections/todos',
    //'views/todos',
    'text!templates/app.html',
    'text!templates/game-controls-toolbar.html',
    'text!templates/story.html'
], function($, _, Backbone, Bootstrap, AppTemplate, GameControlsTemplate, StoryTemplate){
    AppView = Backbone.View.extend({

        el: $("#collaborative_storytelling_app"),

        template: AppTemplate,
        //tagName: "li",

        //className: "document-row",

        events: {
            "click .icon":          "open",
            "click .button.edit":   "openEditDialog",
            "click .button.delete": "destroy"
        },

        initialize: function() {
            //this.listenTo(this.model, "change", this.render);
        },

        render: function() {
            this.$('#nav_section').html(this.template);
            this.$('#story').html(StoryTemplate);
            this.$('#controls').html(GameControlsTemplate);
        }
    });

    return AppView;
});