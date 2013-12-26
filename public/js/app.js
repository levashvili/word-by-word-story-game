define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    //'collections/todos',
    //'views/todos',
    'text!templates/app.html',
    'text!templates/game-controls-toolbar.html'
], function($, _, Backbone, Bootstrap, AppTemplate, GameControlsTemplate){
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
            this.$('#inner_section').html(this.template);
            this.$('#controls_section').html(GameControlsTemplate);
        }
    });

    return AppView;
});