define([
    'jquery',
    'underscore',
    'backbone'
], function($, _){

    var View = Backbone.View.extend({

        tagName: 'h3',

        className: 'h3',

        initialize: function () {

        },

        render: function () {
            this.$el.html(this.model.attributes.title);
            this.$el.show();
            return this;
        }

    });

    return View;
});
