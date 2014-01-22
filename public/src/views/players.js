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
            this.collection.on('reset', function() {
                var avatarModel = this.collection.get(this.collection.getAvatarId());
                if(avatarModel) {
                    avatarModel.set('isAvatar', true);
                }
                this.render();
            }, this);
        },

        render: function(){
            this.$el.empty().hide();
            this.$el.html(this.template({
                players: this.collection.models
            }));
            this.$el.show();
            return this;
        }

    });
    return View;
});