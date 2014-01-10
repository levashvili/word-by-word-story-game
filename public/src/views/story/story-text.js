define([
    'jquery',
    'underscore',
    'backbone',
    'views/text-area/un-editable',
    'views/text-area/editable'
], function($, _, Backbone, UnEditableTextView, EditableTextView){

    var View = Backbone.View.extend({

        initialize: function () {
            this.children = {
                unEditableText: new UnEditableTextView({model: this.model}),
                editableText: new EditableTextView({model: this.model})
            };

            this.$el.hide();
            this.$el.append(this.children.unEditableText.render().el);
            this.$el.append(this.children.editableText.render().el);
        },

        render: function () {
            this.$el.show();
            return this;
        }

    });

    return View;
});
