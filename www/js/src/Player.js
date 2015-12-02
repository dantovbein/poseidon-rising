'use strict';

function Player(config) {
	this.config = config;

	if(this.config.name == undefined) {
		console.log("No se seteo el parámetro: name");
	} else {
		this.name = config.name;
	}

	if(this.config.path == undefined) {
		console.log("No se seteo el parámetro: path");
	} else {
		this.path = config.path;
	}
	
	if(this.config.game == undefined) {
		console.log("No se seteo el parámetro: game");
	} else {
		this.game = config.game;
	}

	this.container = this.config.container || this.config.game;

	//this.image;
	this.game.load.onLoadComplete.add(this.create, this);

	this.preload();
}

Player.prototype.constructor = Player;

Player.prototype = {
	preload: function(){
		//console.log('preload')
		this.game.load.image(this.name,this.path);
		//this.game.load.start();
	},
	create: function(){
		//console.log('Player.loadComplete')
		this.element = this.game.add.sprite(0,0,this.name);

		//this.element.y = 200;
	},
	update: function() {
		//this.element.y += 3;
	},
	get: function(){
		return this.element;
	}
}