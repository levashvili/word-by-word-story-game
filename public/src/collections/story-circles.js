define([
    'underscore',
    'backbone',
    'models/story-circle'
], function(_, Backbone, StoryCircle){
    var StoryCircleCollection = Backbone.Collection.extend({

        model: StoryCircle,

        initialize: function(models, obj) {
            _(this).extend(obj);
        }

//        nextOrder: function () {
//            if (!this.length) {
//                return 1;
//            }
//            return this.last().get('order') + 1;
//        },
//
//        // Players are sorted by their original insertion order.
//        comparator: function (player) {
//            return player.get('order');
//        }
    });

    return StoryCircleCollection;
});
