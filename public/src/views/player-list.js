define(['backbone', 'views/player'], function(Backbone, PlayerView) {

    var View = Backbone.View.extend({
        tagName: 'ul',
        className: 'player-list',
        initialize: function(){
            this.collection.on('reset', this.render, this);
            this.collection.on('add', this.add, this);
        },
        render: function(){
            this.$el.empty().hide();
            this.collection.each(this.add, this);
            return this;
        },
        add: function(model) {
            var child = new PlayerView({model: model});
            this.$el.append(child.render().$el).show();
        }
    });
    return View;
});