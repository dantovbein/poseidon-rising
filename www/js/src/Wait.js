'use strict';

function Wait(config) {
	this.config = config;
	this.game = this.config.game;
}

Wait.prototype.constructor = Wait;

Wait.prototype = {
	init: function() {
		this.stage.backgroundColor = 0x3141df;
	},
	preload: function() {
		this.loadSounds();
		this.game.load.image('wait','assets/images/wait.png');
	},
    loadSounds: function() {
    	this.game.load.audio('background', ['assets/sounds/background-music.wav']);
    },
	create: function() {
		this.bg = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,'wait');
		this.bg.anchor.set(0.5);

		this.bg.inputEnabled = true;
		this.bg.input.useHandCursor = true;
		this.bg.events.onInputDown.add(this.gotoGame, this);

	},
	update: function() { },
	render: function() { },
	gotoGame: function(event,sprite) {
		this.game.state.start('PoseidonRising.Game', true, true);
	}
};