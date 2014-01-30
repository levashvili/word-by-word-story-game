define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/welcome.html',
    'views/create-story-circle'
], function($, _, Backbone, WelcomeTemplate, CreateStoryCircleView){

    var View = Backbone.View.extend({

        className: "jumbotron welcome",

        id: "welcome-view",

        template: _.template(WelcomeTemplate),

        masterView: null,

        events: {
            'click #create-circle': function() {
                this.masterView.openCreateStoryCircleView();
            },
            'click #join-circle': function() { alert('joining circle');}
        },

        initialize: function (obj) {
            _(this).extend(obj);

        },

        render: function () {
            this.$el.html(this.template({}));
            this.$el.show();
            return this;
        }
    });

    return View;
});
