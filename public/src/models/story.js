define(['underscore', 'backbone.localStorage'], function(_, BackboneLocalStorage) {

    var store = new BackboneLocalStorage(window.store || "Stories"); // for testing purposes

    var Story = Backbone.Model.extend({
        localStorage: store,
        defaults: {
            title: "",
            text: "",
            timestamp: 0,
            completed: false
        },

        validate: function(attrs) {
//            if ( _.isEmpty(attrs.title) ) {
//                return "Missing Title";
//            }
        }
    });

    return Story;
});