describe("Player", function() {
    var player;
    var song;

    beforeEach(function() {
        player = new Player(["Iris", 18, "female"]);
    });

    it("should return correct name", function() {
        player.get('name');
        expect(player.get('name')).toEqual('Iris');

    });

});
