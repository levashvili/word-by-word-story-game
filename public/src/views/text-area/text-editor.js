define(['backbone', 'underscore'], function(Backbone, _) {

    var template = _.template('enter text here');

    var TextEditorView = Backbone.View.extend({
        tagName: 'span',

        clicked: false,

        keyPressed: false,

        attributes: {
            contenteditable: true
        },

        initialize: function(){
//            var events = 'add reset remove change:completed';
//            this.collection.on(events, this.render, this);
        },
        render: function() {
            this.$el.show().html( template({}) );
            return this;
        },
        events: {
            //ui events
            keyup: function() {
                this.keyPressed = true;
            },

            click: function() {
                this.clicked = true;
            }
        },

        getClicked: function() {
            return this.clicked;
        },

        getKeyPressed: function() {
            return this.keyPressed;
        }
    });

    return TextEditorView;
});