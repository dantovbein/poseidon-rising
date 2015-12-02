(function(){

'use strict';

var PoseidonRising = {};

var game = new Phaser.Game(800,600,Phaser.AUTO);

game.state.add('PoseidonRising.Game',new Game({ game: game }));
game.state.add('PoseidonRising.Wait',new Wait({ game: game }));

game.state.start('PoseidonRising.Wait');

})();