define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/story-paragraph.html'
], function($, _, Backbone, StoryParagraphTemplate){

    var View = Backbone.View.extend({

        tagName: 'p',

        template: _.template(StoryParagraphTemplate),

        events: {
            'click span': 'onClickSpan',
            'blur span': 'onBlurSpan',
            'keydown span': 'onKeyDownSpan',
            'keyup span': 'onKeyUpSpan'
        },

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
//            this.$el.show();
            return this;
        },

        onClickSpan: function(event) {
            console.log(event);
            //var paragraphNum = event.target.id.slice(10,11);
            if(event.target.classList.contains("text-muted")) {
                //this.model.setPlaceholder(paragraphNum, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
                $(event.target).html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
                event.target.classList.remove("text-muted");
                event.target.classList.add("text-primary");
            }
            $(event.target).focus();
        },

        onBlurSpan: function(event) {

            this.render();
        },

        onKeyDownSpan: function(event) {

//            var paragraphNum = event.target.id.slice(10,11);
            this.model.set("editableText", $(event.target).html(), {silent:true});
            $(event.target).focus();
        },

        onKeyUpSpan: function(event) {

//            var paragraphNum = event.target.id.slice(10,11);
            this.model.set("editableText", $(event.target).html(), {silent: true});
            $(event.target).focus();
        }
    });

    return View;
});