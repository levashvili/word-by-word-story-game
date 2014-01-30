define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/create-story-circle.html',
    'models/story-circle'
], function($, _, Backbone, CreateStoryCircleTemplate, StoryCircle){

    var View = Backbone.View.extend({

        tagName: "form",

        className: "form-horizontal",

        id: "create-story-circle",

        model: new StoryCircle(),

        attributes: {
            role: 'form'
        },

        events: {
            'click #create': function() { this.create(); },
            'keyup #input-name': function() { this.enableCreate(); },
            'keyup #input-circle-name': function() { this.enableCreate(); },
            'keyup #input-max-players': function() { this.enableCreate(); }
        },

        template: _.template(CreateStoryCircleTemplate),

        initialize: function (obj) {
            _(this).extend(obj);
            this.model.on('change', function() {
                alert('model has been changed');
            });
        },

        render: function () {
            this.$el.html(this.template({}));
            return this;
        },

        getPlayerName: function() {
            return $(this.$el.find('#input-name')[0]).val();
        },

        getStoryCircleName: function() {
            return $(this.$el.find('#input-circle-name')[0]).val();
        },

        getMaxNumPlayers: function() {
            return $(this.$el.find('#input-max-players')[0]).val();
        },

        create: function() {
            //alert(this.getPlayerName() + ' ' + this.getStoryCircleName() + ' ' + this.getMaxNumPlayers());
//            this.collection.add({
//                playerName: this.getPlayerName(),
//                storyCircleName: this.getStoryCircleName(),
//                maxNumPlayers: this.getMaxNumPlayers()
//            });
            this.socketEvents.createStoryCircle({
                playerName: this.getPlayerName(),
                storyCircleName: this.getStoryCircleName(),
                maxNumPlayers: this.getMaxNumPlayers()
            });
        },

        validate: function() {
            return (this.getPlayerName() != "") &&
                (this.getStoryCircleName() != "")
        },

        enableCreate: function() {
            if(this.validate()) {
                $(this.$el.find('#create')[0]).removeAttr("disabled");
            } else {
                $(this.$el.find('#create')[0]).attr("disabled", "disabled");
            }
        }
    });

    return View;
});
