debugger;

describe('View :: Story Text Area', function() {

    beforeEach(function() {
        var flag = false,
            that = this;

        require(['views/text-area/story-text-area'], function(StoryTextAreaView) {
            that.customEvents = _.extend({}, Backbone.Events);

            that.view = new StoryTextAreaView({
                parentEl: $('#sandbox'),
                customEvents: that.customEvents,
                contentText: 'enter text here'
            });
            that.view.render();

            flag = true;
        });

        waitsFor(function() {
            return flag;
        });

    });

    afterEach(function() {
        this.view.remove();
    });

    it('can be editable', function() {
        this.view.startEditing();
        expect(this.view.isEditable()).toEqual(true);
    });

    it('or not', function() {
        this.view.stopEditing();
        expect(this.view.isEditable()).toEqual(false);
    });

    it('can empty contents', function() {
        this.view.emptyContents();
        expect(this.view.getContents()).toEqual("");
    });

    it('can set contents', function() {
        this.view.setContents('New contents');
        expect(this.view.getContents()).toEqual('New contents');
    });

    it('can append contents', function() {
        this.view.setContents('New contents');
        this.view.appendContents('a');
        expect(this.view.getContents()).toEqual('New contentsa');
    });

//        it('submits on enter', function() {
//            expect(this.view.$el.is(':focus'), 'element to be focused by default').toEqual(true);
//
//            var flag = false;
//
//            var press = jQuery.Event("keydown");
//            press.ctrlKey = false;
//            press.which = 13;
//
////            this.view.on('text-editor:submit',function() {
////                flag = true;
////            });
//            this.customEvents.on('text-editor:submit',function() {
//                flag = true;
//            });
//
//            this.view.$el.trigger(press);
//
//            //expect(flag).toEqual(true);
//
//            waitsFor(function() {
//                return flag;
//            });
//        })


//    describe('should be able to alter edit mode', function() {
//        it('should exit edit mode on successful submit', function() {
//            this.customEvents.trigger('text-editor:stopEditing');
//            expect(this.view.isEditable()).toEqual(false);
//        });
//    });
});