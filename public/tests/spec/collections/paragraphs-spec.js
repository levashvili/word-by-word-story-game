debugger;

describe('Collection :: Paragraphs', function() {

    beforeEach(function() {
        var that = this,
            done = false;

        require(['models/paragraph', 'collections/paragraphs'], function(Paragraph, Paragraphs) {
            that.paragraphs = new Paragraphs();
            that.paragraphs.add({
                number: 1,
                unEditableText: 'First paragraph. First paragraph. First paragraph. First paragraph. First paragraph. First paragraph. First paragraph. First paragraph. First paragraph. First paragraph. '
            });
            that.paragraphs.add({
                number: 2,
                unEditableText: 'Second paragraph. Second paragraph. Second paragraph. Second paragraph. Second paragraph. Second paragraph. Second paragraph. Second paragraph. '
            });
            that.paragraphs.add({
                number: 3,
                unEditableText: 'Third paragraph. Third paragraph. Third paragraph. Third paragraph. Third paragraph. Third paragraph. Third paragraph. Third paragraph. Third paragraph. ',
                editableText: 'This is editable text.'
            });
            that.paragraphs.add({
                number: 4,
                editableText: 'This is more editable text. ',
                placeholder: 'Start typing here..'
            });
            that.paragraphs.add({
                number: 5,
                editableText: '',
                placeholder: 'Start typing here..'
            });
            done = true;
        });

        waitsFor(function() {
            return done;
        }, "Create Collection");

    });

    afterEach(function(){
        var done = false,
            isDone = function(){ return done; };

        this.paragraphs.on('reset', function() {
            done = true;
        });
        this.paragraphs.reset();

        waitsFor(isDone);
    });

    describe('Testing number of paragraphs', function() {
        it('should return correct number', function() {
            expect(this.paragraphs.length).toEqual(5);
        });

    });

    describe('Testing filtration', function() {
        it('should return unEditable paragraphs', function() {
            expect(this.paragraphs.unEditable().length).toEqual(2);
        });

        it('should return editable paragraphs', function() {
            expect(this.paragraphs.editable().length).toEqual(3);
        });
    });

});