define([
    'backbone',
    'views/players',
    'views/story-editor',
    'text!templates/master.html'
], function(Backbone, PlayerList, StoryEditor, MasterTemplate) {
    var View = Backbone.View.extend({
        className: 'masterView',
        template: _.template(MasterTemplate),
        //gameRoomEvents: _.extend({},Backbone.Events),
        initialize: function(obj){
            _(this).extend(obj);
            this.children = {
                playerList: new PlayerList({
                    collection: this.playerCollection
                }),
                storyEditor: new StoryEditor({
                    model: this.story,
                    gameRoomEvents: this.gameRoomEvents
                })
                //storyToolbar: new StoryToolbar()
            };
            this.$el.hide();
            this.$el.html(this.template({}));
            $(this.$el.find("#game-room-players")[0]).append(this.children.playerList.render().el);
//            $(this.$el.find("#game-room-players")[0]).append('<p>');
            $(this.$el.find("#story-editor")[0]).append(this.children.storyEditor.render().el)
//            this.$el.append(this.children.playerList.render().el);
//            this.$el.append(this.children.storyEditor.render().el);
            //this.$el.append(this.children.storyToolbar.render().el);
        },
        render: function(){
            this.$el.show();
            return this;
        }
    });
    return View;
});