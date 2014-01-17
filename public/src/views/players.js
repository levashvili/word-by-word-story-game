define([
    'backbone',
    'views/player',
    'text!templates/players.html'
], function(Backbone, PlayerView, PlayersTemplate) {

    var View = Backbone.View.extend({

        tagName: 'div',

        className: 'container',

        template: _.template(PlayersTemplate),

        initialize: function(){
            this.collection.on('reset', this.render, this);
            this.collection.on('add', this.render, this);
        },

        render: function(){
            this.$el.empty().hide();
            this.$el.html(this.template({
                players: this.collection.models
            }));
            this.$el.show();
            return this;
//            this.playersList = $(this.$el.find('ul')[0]);
//            this.leftScrollButton = $(this.$el.find('#left-scroll')[0]);
//            this.rightScrollButton = $(this.$el.find('#right-scroll')[0]);
//
//            this.leftScrollButton.on('click', this.scrollLeft.bind(this));
//            this.leftScrollButton.on('click', this.scrollRight.bind(this));
////            this.$el.html(this.template({}));
////            $.after($(this.$el.find("#left-scroll")[0]), '<ul></ul>');
//            this.collection.each(this.add, this);
//            return this;
        },

        add: function(model) {
            var child = new PlayerView({model: model});

            this.playersList.append(child.render().$el).show();
        }
    });
    return View;
});