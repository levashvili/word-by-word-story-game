describe('Model :: Story', function() {

    var mockData = { title: 'The Great Gatsby',
        text: "In my younger and more vulnerable years my father gave me some advice that I’ve been turning over in my mind ever since.",
        timestamp: new Date().getTime()
    };

    beforeEach(function() {
        var that = this,
            done = false;

        try {
            require(['models/story', 'collections/stories'], function(Story, Stories) {
                that.stories = new Stories();
                that.story = new Story();
                done = true;
            });
        } catch(error) {
            console.log(error);
        }


        waitsFor(function() {
            return done;
        }, "Create Models");

    });

    afterEach(function(){
        var done = false,
            isDone = function(){ return done; };

        this.stories.fetch({
            success: function(c) {
                c.each(function(m){
                    m.destroy();
                });
                done = true;
            }
        });

        waitsFor(isDone);

        done = false;
        this.story.destroy({
            success: function(){
                done = true;
            }
        });

        waitsFor(isDone);

    });

    describe('.Create()', function() {

        it('should create a story', function() {
            var done = false;
            var story = this.stories.create(mockData, {
                success: function() {
                    done = true;
                }
            });

            waitsFor(function() { return done; });

            runs(function(){
                expect(story).not.toBe(null);
                expect(story.get('completed')).toEqual(false);
                expect(story.get('title')).toEqual("The Great Gatsby");
                expect(story.get('timestamp')).toEqual(jasmine.any(Number));
                expect(story.id).toEqual(jasmine.any(String));
            });

        });

        it('should succeed creating a title-less story', function() {
            var spy = jasmine.createSpy();
            this.story.on('error', spy);
            this.story.save({});
            expect(spy.callCount).toEqual(0);
            expect(this.story.id).not.toBeUndefined();
            expect(this.story.get('title')).toEqual("");
        });

    });

    xdescribe('.Read()', function() {
        it('should read models from collection', function() {
            var done = false,
                spy = jasmine.createSpy();
            todos = this.todos;

            todos.on('reset', spy);
            this.todo.on('sync', spy);


            this.todo.on('sync', function(){
                expect(todos.size()).toEqual(0);
                expect(spy.callCount).toEqual(1);

                todos.reset();

                expect(todos.size()).toEqual(0);
                expect(spy.callCount).toEqual(2);

                todos.fetch({
                    success: function(){
                        expect(todos.size()).toEqual(1);
                        expect(spy.callCount).toEqual(3);
                        done = true;
                    }
                });

            }, this);

            this.todo.save(mockData);


            waitsFor(function() { return done; });

        });

        it('should have proper remaining and completed methods', function() {

            var completedMock = _.extend({completed: true}, mockData);
            this.todos.add([mockData,mockData,mockData,completedMock]);

            expect(this.todos.remaining().length).toEqual(3);
            expect(this.todos.completed().length).toEqual(1);

            this.todos.remaining()[0].set({completed: true});

            expect(this.todos.remaining().length).toEqual(2);
            expect(this.todos.completed().length).toEqual(2);

        });
    });


});