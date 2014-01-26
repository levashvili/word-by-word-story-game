define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/welcome.html'
], function($, _, Backbone, WelcomeTemplate){

    var View = Backbone.View.extend({

        className: "jumbotron welcome",

        id: "welcome-view",

        template: _.template(WelcomeTemplate),

        initialize: function (obj) {
            _(this).extend(obj);

        },

        render: function () {
            this.$el.html(this.template({}));
            return this;
        }
    });

    return View;
});
