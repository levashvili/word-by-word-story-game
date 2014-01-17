define([
    'backbone',
    'views/player'
], function(Backbone, PlayerView) {

    var View = Backbone.View.extend({

        tagName: 'div',

        className: 'carousel',

        initialize: function(){

        },

        render: function(){
            this.$el.append('<a id="scroll-left" class="left-scroll"><span class="glyphicon glyphicon-chevron-left"></span></a>');
            this.$el.append('<a id="scroll-right" class="right-scroll"><span class="glyphicon glyphicon-chevron-right"></span></a>');
//            this.$el.empty().hide();
//            this.$el.html(this.template());
//            this.$el.show();
            return this;
        }


    });
    return View;
});
