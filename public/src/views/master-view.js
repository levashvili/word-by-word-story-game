define([
    'backbone',
    'views/players',
    'views/story-editor',
    'views/welcome',
    'views/navigation',
    'views/create-story-circle',
    'text!templates/master.html',
    'views/story-circles',
    'views/story-circle-editor'
], function(Backbone, PlayerList, StoryEditor, WelcomeView, NavigationView,
            CreateStoryCircleView, MasterTemplate, StoryCirclesView, StoryEditorView) {
    var View = Backbone.View.extend({

        id: 'master-view',

        template: _.template(MasterTemplate),

        initialize: function(obj){
            _(this).extend(obj);
            this.$el.hide();
            this.$el.html(this.template({}));
            this.children = {
//                playerList: new PlayerList({
//                    collection: this.playerCollection
//                }),
//                storyEditor: new StoryEditor({
//                    collection:this.playerCollection,
//                    model: this.story,
//                    gameRoomEvents: this.gameRoomEvents,
//                    socketEvents: this.socketEvents
//                }),
                navigationView: new NavigationView({
                    masterView: this
                }),
                welcomeView: new WelcomeView({
                    masterView: this
                }),
                createStoryCircleView: new CreateStoryCircleView({
                    collection: this.storyCircles,
                    socketEvents: this.socketEvents
                }),
                storyCirclesView: new StoryCirclesView({
                    collection: this.storyCircles,
                    masterView: this
                }),
                storyEditorView: new StoryEditorView({
                    collection:this.playerCollection,
                    model: this.story,
                    gameRoomEvents: this.gameRoomEvents,
                    socketEvents: this.socketEvents
                })
            };
            this.children.welcomeView.render();
            this.children.navigationView.render();
            this.children.createStoryCircleView.render();
            this.children.storyCirclesView.render();
            this.children.storyEditorView.render();
       },

        render: function(){
            this.addNavigation();
            this.openWelcomeView();
            this.$el.show();
            return this;
        },

        addNavigation: function() {
            this.children.navigationView.$el.appendTo($(this.$el.find('#navigation')[0]));
        },

        openCreateStoryCircleView: function() {
            this.detachAll();
            this.children.createStoryCircleView.$el.appendTo($(this.$el.find('#main-content')[0]));
        },

        openJoinStoryCircleView: function() {

        },

        openWelcomeView: function() {
            this.detachAll();
            this.children.welcomeView.$el.appendTo($(this.$el.find('#main-content')[0]));
        },

        openStoryCirclesView: function() {
            this.detachAll();
            this.children.storyCirclesView.$el.appendTo($(this.$el.find('#main-content')[0]));
        },

        openStoryEditorView: function() {
            this.detachAll();
            this.children.storyEditorView.$el.appendTo($(this.$el.find('#main-content')[0]));
        },

        detachAll: function() {
            this.children.welcomeView.$el.detach();
            this.children.createStoryCircleView.$el.detach();
            this.children.storyCirclesView.$el.detach();
            this.children.storyEditorView.$el.detach();
        }
    });
    return View;
});