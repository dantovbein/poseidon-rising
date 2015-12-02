'use strict';

var Enemies = function(game) {
	Phaser.Group.call(this, game);

	this.game = game;
	
	this.BUILDING_CORNER = "buildingCorner";
	this.HAZARD = "hazard";
	this.RUIN = "ruin";
	this.TENTACLES = "tentacles";
	this.TOWER = "tower";
	this.BROKEN_TOWER = "brokenTower";

	this.TYPE_OF_ENEMIES = [{ name: this.TENTACLES, path: "assets/images/tentacles.png"},
							{ name: this.TOWER, path: "assets/images/tower.png"},
							{ name: this.BROKEN_TOWER, path: "assets/images/tower-2.png"},
							{ name: this.HAZARD, path: "assets/images/hazard.png"},
							{ name: this.RUIN, path: "assets/images/ruin.png"},
							{ name: this.BUILDING_CORNER, path: "assets/images/building-corner.png"}];

	this.randomEnemies = [];

	var sprite;
	window._.each(this.TYPE_OF_ENEMIES,function(enemy){
		sprite = this.create(0,0, enemy.name);
		this.game.add.sprite(0,0,enemy.name);        
    },this);
}

Enemies.prototype = Object.create(Phaser.Group.prototype);

Enemies.prototype.constructor = Enemies;

/*Enemies.prototype.preload = function() {
	conmsole.log("preload");
	
}*/

Enemies.prototype.create = function() {
	Phaser.Group.prototype.create.call(this);
	console.log("create group");

	/*window._.each(this.randomEnemies,function(ind){
    		randomY = Math.floor(Math.random() * (yDistance - y)) + y;
    		enemy = this.enemiesGroup.create(this.game.world.randomX, randomY + this.game.height,  this.TYPE_OF_ENEMIES[ind].name, this.game.rnd.integerInRange(0, 36));
	       	enemy.name = this.TYPE_OF_ENEMIES[ind].name;
	       	enemy.body.collideWorldBounds = true;
	       	switch(enemy.name) {
	       		case this.TENTACLES:
	       			enemy.body.setSize(105,10,28,106);
	       			break;
	       		case this.TOWER:
	       			enemy.body.setSize(44,18,10,147);
	       			break;
	       		case this.BROKEN_TOWER:
	       			enemy.body.setSize(44,18,10,147);
	       			break;
	       		case this.BUILDING_CORNER:
	       			enemy.body.setSize(62,20,18,30);
	       			break;
	       		case this.RUIN:
	       			enemy.body.setSize(76,20,26,40);
	       			break;
	       		case this.HAZARD:
	       			enemy.body.setSize(35,21,8,50);
	       			break;	
	       	}
			enemy.anchor.set(0,0);
	       	enemy.body.immovable = true;
	   	},this);*/
}

Enemies.prototype.update = function() {
	//console.log("update group");
}

Enemies.prototype.releaseEnemies = function(y,yDistance) {
	// reset enemies
	this.enemiesGroup.forEachAlive(function(e){
		if(e.y < (y - this.game.height)) {
			e.kill();
			//console.log("Elimino enemigo");
		} else {
			//console.log("No elimino enemigo");
		}
	},this);

	var randomY;
	var enemy;
	this.randomEnemies = this.generateRandoms(this.TOTAL_ENEMIES,this.TYPE_OF_ENEMIES.length);
	window._.each(this.randomEnemies,function(ind){
		randomY = Math.floor(Math.random() * (yDistance - y)) + y;
		enemy = this.enemiesGroup.create(this.game.world.randomX, randomY + this.game.height,  this.TYPE_OF_ENEMIES[ind].name, this.game.rnd.integerInRange(0, 36));
       	enemy.name = this.TYPE_OF_ENEMIES[ind].name;
       	enemy.body.collideWorldBounds = true;
       	switch(enemy.name) {
       		case this.TENTACLES:
       			enemy.body.setSize(105,10,28,106);
       			break;
       		case this.TOWER:
       			enemy.body.setSize(44,18,10,147);
       			break;
       		case this.BROKEN_TOWER:
       			enemy.body.setSize(44,18,10,147);
       			break;
       		case this.BUILDING_CORNER:
       			enemy.body.setSize(62,20,18,30);
       			break;
       		case this.RUIN:
       			enemy.body.setSize(76,20,26,40);
       			break;
       		case this.HAZARD:
       			enemy.body.setSize(35,21,8,50);
       			break;	
       	}
		enemy.anchor.set(0,0);
       	enemy.body.immovable = true;
   	},this);
}

Enemies.prototype.generateRandoms = function(total,totalTypes) {
	var tmp = [];
	for(var i=0; i<total;i++){
		tmp.push(Math.floor((Math.random() * totalTypes) + 1) - 1);
	}
	return tmp;
}