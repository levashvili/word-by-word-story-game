define([
    'jquery',
    'underscore',
    'backbone'
    //'collections/todos',
    //'views/todos',
    //'text!templates/stats.html'
], function($, _, Backbone){
    AppView = Backbone.View.extend({

        el: $("#collaborative_storytelling_app"),

        render: function() {
            this.$('#inner_section').html("<div><p>Some content here</p></div>");
        },

        addOne: function (todo) {

        },

        addAll: function () {

        },

        filterOne: function (todo) {

        },

        filterAll: function () {

        },

        newAttributes: function () {

        },

        createOnEnter: function (e) {

        },

        clearCompleted: function () {

        },

        toggleAllComplete: function () {

        }
    });
});