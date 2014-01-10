define([
    'backbone',
    'views/player-list',
    'views/story-editor'
], function(Backbone, PlayerList, StoryEditor) {
    var View = Backbone.View.extend({
        className: 'masterView',
        initialize: function(obj){
            _(this).extend(obj);
            this.children = {
                playerList: new PlayerList({collection: this.playerCollection}),
                storyEditor: new StoryEditor({model: this.story})
                //storyToolbar: new StoryToolbar()
            };
            this.$el.hide();
            this.$el.append(this.children.playerList.render().el);
            this.$el.append(this.children.storyEditor.render().el);
            //this.$el.append(this.children.storyToolbar.render().el);
        },
        render: function(){
            this.$el.show();
            return this;
        }
    });
    return View;
});