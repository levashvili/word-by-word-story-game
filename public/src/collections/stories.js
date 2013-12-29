define(['underscore', 'backbone.localStorage', 'models/story'], function(_, BackboneLocalStorage, Story) {

    var store = new BackboneLocalStorage(window.store || "Stories"); // for testing purposes

    var Stories = Backbone.Collection.extend({
        localStorage: store,
        model: Story

//        completed: function() {
//            return this.where({completed: true});
//        },
//        remaining: function() {
//            return this.where({completed: false});
//        },
//        comparator: function(model){
//            return model.get('timestamp');
//        }
    });

    return Stories;
});