'use strict';

var Enemy = function(game,x,y,enemyType) {
	Phaser.Sprite.call(this, game, x, y,enemyType);
	game.load.image("tentacles","assets/images/tentacles.png");
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);

Enemy.prototype.constructor = Enemy;

Enemy.prototype.create = function() {
	console.log("create");
}

Enemy.prototype.update = function() {
	Phaser.Sprite.prototype.update.call(this);
}