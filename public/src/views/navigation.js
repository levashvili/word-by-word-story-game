define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/navigation.html'
], function($, _, Backbone, NavigationTemplate){

    var View = Backbone.View.extend({

        tagName: 'nav',

        className: '',

        attributes: {
            role: 'navigation'
        },

        events: {
            'click #nav-story-circles': function() {
                this.masterView.openStoryCirclesView();
            },
            'click #nav-home': function() {
                this.masterView.openWelcomeView();
            }
        },

        template: _.template(NavigationTemplate),

        gameTurn: false,

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
