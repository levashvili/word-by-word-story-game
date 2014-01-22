debugger;

describe('View :: Players', function() {

    beforeEach(function() {
        var flag = false,
            that = this;

        require(['views/players', 'collections/players'], function(PlayersView, PlayersCollection) {
            that.players = new PlayersCollection();

            that.view = new PlayersView({
                collection: that.players
            });

            $('#sandbox').append(that.view.render().el);

            flag = true;
        });

        waitsFor(function() {
            return flag;
        });

    });

    afterEach(function() {
        this.view.remove();
    });

    it('contains no players initially', function() {
        expect(this.view.$el.find('.col').length).toEqual(0);
    });

    it('updates players on reset and displays in correct order', function() {
        this.players.reset([{
            id: 1,
            name: "Marge"
        },{
            id: 2,
            name: "Chloe"
        },{
            id: 3,
            name: "Leena"
        }]);

        expect(this.view.$el.find('.col').length).toEqual(3);

        expect($((this.view.$el.find('.col'))[0].children[0]).html()).toEqual('Marge');
        expect($((this.view.$el.find('.col'))[1].children[0]).html()).toEqual('Chloe');
        expect($((this.view.$el.find('.col'))[2].children[0]).html()).toEqual('Leena');
    });

});