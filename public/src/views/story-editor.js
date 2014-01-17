define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/story-editor.html',
    'views/story-text',
    'views/story-editor-toolbar',
    'views/story-paragraph'
], function($, _, Backbone, StoryEditorTemplate, StoryTextView, StoryEditorToolbar, ParagraphView){

    var View = Backbone.View.extend({

        tagName: 'div',

        className: 'panel panel-default',

        template: _.template(StoryEditorTemplate),

        //gameRoomEvents: _.extend({}, Backbone.Events),

        paragraphViews: [],

//        events: {
//            'click span': 'onClickSpan',
//            'blur span': 'onBlurSpan',
//            'keydown span': 'onKeyDownSpan'
//        },

        initialize: function (obj) {
            _(this).extend(obj);

            this.listenTo(this.model, 'change:paragraphs', this.render);

            this.children = {
                //storyTextView: new StoryTextView({model: this.model}),
                storyEditorToolbar: new StoryEditorToolbar({
                    model: this.model,
                    gameRoomEvents: this.gameRoomEvents,
                    socketEvents: this.socketEvents
                })
            };
            this.$el.hide();
            //this.$el.append(this.children.storyTextView.render().el);
            //this.$el.append(this.children.storyEditorToolbar.render().el);

        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            _.each(this.model.attributes.paragraphs.models, function(paragraph) {
                var paragraphView = new ParagraphView({model: paragraph});
                this.paragraphViews.push(paragraphView);
                $(this.$el.find('#story-text')[0]).append(paragraphView.render().el);
            }.bind(this))
            //this.$el.find('#story-text')[0].appendChild(this.children.storyTextView.render().el);
            this.$el.find('#story-toolbar')[0].appendChild(this.children.storyEditorToolbar.render().el);
            //this.$el.children('#story-text').appendChild(this.children.storyTextView.el);
            this.$el.show();
            return this;
        }

//        onClickSpan: function(event) {
//            console.log(event);
//            //var paragraphNum = event.target.id.slice(10,11);
//            if(event.target.classList.contains("text-muted")) {
//                //this.model.setPlaceholder(paragraphNum, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
//                $(event.target).html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
//                event.target.classList.remove("text-muted");
//                event.target.classList.add("text-primary");
//            }
//            $(event.target).focus();
//        },
//
//        onBlurSpan: function(event) {
//
//            this.render();
//        },
//
//        onKeyDownSpan: function(event) {
//
//            var paragraphNum = event.target.id.slice(10,11);
//            this.model.setEditableText(paragraphNum, $(event.target).html());
//        }

    });

    return View;
});
