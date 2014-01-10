debugger;

describe('Model :: Story', function() {

    var mockData = { title: 'The Great Gatsby',
        paragraphs: [],
        timestamp: new Date().getTime()
    };

    beforeEach(function() {
        var that = this,
            done = false;

        require(['models/story'], function(Story) {
            that.customEvents = _.extend({}, Backbone.Events);
            that.story = new Story(mockData, {customEvents: that.customEvents});
            done = true;
        });

        waitsFor(function() {
            return done;
        }, "Create Models");

    });

    afterEach(function(){
        var done = false,
            isDone = function(){ return done; };

        this.story.destroy({
            success: function(){
                done = true;
            }
        });

        waitsFor(isDone);
    });

    describe('Adding a paragraph', function() {
        it('should add paragraph to story', function() {
            expect(this.story.numberOfParagraphs(), 'initial number of paragraphs').toEqual(0);
            this.story.addParagraph();
            expect(this.story.numberOfParagraphs(), 'number of paragraphs after adding 1').toEqual(1);
        });

        it('unless there is already an empty paragraph', function() {

            expect(this.story.numberOfParagraphs(), 'number of paragraphs initially').toEqual(1);

            this.story.addParagraph('Paragraph 1');
            expect(this.story.numberOfParagraphs()).toEqual(1);
            expect(this.story.getParagraphAt(1)).toEqual('Paragraph 1');
        });

        it('adds empty paragraph if non-string value is passed', function() {
            expect(this.story.numberOfParagraphs(), 'number of paragraphs initially').toEqual(1);

            this.story.addParagraph(1234);

            expect(this.story.numberOfParagraphs()).toEqual(2);

            expect(this.story.getParagraphAt(2)).toEqual('');
        })
    });

    xdescribe('.Create()', function() {

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