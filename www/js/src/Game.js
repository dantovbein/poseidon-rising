'use strict';

function Game(config) {
	this.config = config;
	this.game = this.config.game;

	this.STAGE_WIDTH = this.game.width;
	this.INITIAL_STAGE_HEIGHT = 3000;
	
	this.TOTAL_ENEMIES_FOR_LEVEL = 10;
	this.TOTAL_BONUS_FOR_LEVEL = this.TOTAL_ENEMIES_FOR_LEVEL * 0.35;
	this.LEVEL_TIME = 5;
	this.TIME_RELEASE_ITEMS = 400;

	this.INITIAL_POS_Y_START = 130; 
	this.INITIAL_POS_Y_SKI = this.INITIAL_POS_Y_START + 55;
	this.INITIAL_POS_Y_ENEMIES = 280;
	this.INITIAL_POS_Y_FLAGS = 280;

	this.BACKGROUND_OVERLAP = "backgroundOverlap";
	this.WAVES = "waves";

	this.COUNTDOWN_1 = "countdown1";
	this.COUNTDOWN_2 = "countdown2";
	this.COUNTDOWN_3 = "countdown3";
	this.COUNTDOWN_GO = "countdownGo";
	this.CHARACTER = "character";
	this.START_BRIDGE = "startBridge";
	this.SHADOW_START_BRIDGE = "shadowStartBridge";
	this.SKI = "ski";	
	this.BUILDING_CORNER = "buildingCorner";
	this.HAZARD = "hazard";
	this.RUIN = "ruin";
	this.TENTACLES = "tentacles";
	this.TOWER = "tower";
	this.BROKEN_TOWER = "brokenTower";
	this.FLAGS_1 = "flags1";
	this.FLAGS_2 = "flags2";
	this.TURN_ON_LIGHTS = "turnOnLights";
	
	this.TYPE_OF_ENEMIES = [{ name: this.TENTACLES, path: "assets/images/tentacles.png"},
							{ name: this.TOWER, path: "assets/images/tower.png"},
							{ name: this.BROKEN_TOWER, path: "assets/images/tower-2.png"},
							{ name: this.HAZARD, path: "assets/images/hazard.png"},
							{ name: this.RUIN, path: "assets/images/ruin.png"},
							{ name: this.BUILDING_CORNER, path: "assets/images/building-corner.png"}];

	this.TYPE_OF_BONUS = [{ name: this.FLAGS_1, path: "assets/images/flags1.png", w:152, h:39, points:5 },
						  { name: this.FLAGS_2, path: "assets/images/flags2.png", w:93, h:35, points:7 }];
	
	this.score = 0;
	
	this.initialSpeed = 5;
	this.currentSpeed = this.initialSpeed;
	this.aceleration = 0.10;
	this.level = 1;
	this.angle = 1;
	this.gameTime = 0;
	this.tickCountdown = 0;
	this.gameOver = false;

	this.randomEnemies = [];
	this.randomFlags = [];

	this.volume = 1;
	this.startGame = false;

	this.middle = this.game.width / 2;
	this.mouseX = 0;

	this.isDebug = !true;

	this.lastItemName = "";
	this.lastItemPosX = 0;
	this.lastItemPosY = 0;
	this.lastItemWidth = 0;
	this.lastItemHeight = 0;
	this.lastItem;

	this.lastCameraY = 0;
	this.distance = 0;
	
	this.fps = 0;
}

Game.prototype.constructor = Game;

Game.prototype = {
	init: function() {
		this.stage.backgroundColor = 0x3141df;

		this.game.world.resize(this.STAGE_WIDTH, this.INITIAL_STAGE_HEIGHT);
		
		this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	},
	preload: function() {
		
		this.loadSounds();

		this.game.load.bitmapFont('fat-and-tiny', 'assets/fonts/fat-and-tiny.png', 'assets/fonts/fat-and-tiny.xml');

        this.game.load.image(this.BACKGROUND_OVERLAP,'assets/images/background-overlap.png');
       	this.game.load.image(this.WAVES,'assets/images/waves.png');
        
        this.game.load.image(this.COUNTDOWN_1,'assets/images/countdown-1.png');
		this.game.load.image(this.COUNTDOWN_2,'assets/images/countdown-2.png');
		this.game.load.image(this.COUNTDOWN_3,'assets/images/countdown-3.png');
		this.game.load.image(this.COUNTDOWN_GO,'assets/images/countdown-GO.png');

		this.game.load.image(this.START_BRIDGE,'assets/images/start.png');
		this.game.load.image(this.SHADOW_START_BRIDGE,'assets/images/start-shadow.png');

		window._.each(this.TYPE_OF_ENEMIES,function(enemy){
			this.game.load.image(enemy.name, enemy.path);
    	},this);
    	
    	window._.each(this.TYPE_OF_BONUS,function(bonus){
			this.game.load.spritesheet(bonus.name, bonus.path, bonus.w, bonus.h, 2);
    	},this);

    	this.game.load.spritesheet(this.CHARACTER, 'assets/images/jetski.png', 82, 95, 2);

    	this.game.time.advancedTiming = true;
    	
    },
    loadSounds: function() {
    	// Load Sounds
		this.game.load.audio('background', ['assets/sounds/background-music.wav']);
		this.game.load.audio('beep', ['assets/sounds/beep.wav']);
		this.game.load.audio('go-tone', ['assets/sounds/go-tone.wav']);
		this.game.load.audio('hit-object', ['assets/sounds/hit-object.wav']);
		this.game.load.audio('jetski-loop', ['assets/sounds/jetski-loop.wav']);
		this.game.load.audio('open-sea-ambience', ['assets/sounds/open-sea-ambience-loop.wav']);
		this.game.load.audio('crash', ['assets/sounds/crash.wav']);
    },
	create: function() {
		//this.enemies = new Enemies(this.game);
		
		this.game.sound.play('background',this.volume * 0.9,true);
		this.jetSkiSound = this.game.add.audio('jetski-loop',this.volume * 0.5,true);
		this.jetSkiSound.play();
		this.game.sound.play('open-sea-ambience',this.volume * 0.8,true);
		this.cowntdownSound = this.game.add.audio('beep',this.volume,false);
		this.cowntdownSoundGo = this.game.add.audio('go-tone',this.volume,false);

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		
		this.waves = this.game.add.tileSprite(0,this.game.camera.y, this.game.width, this.game.height, this.WAVES);
   		this.backgroundOverlap = this.game.add.image(0,0,this.BACKGROUND_OVERLAP);

   		this.scoreText = this.add.bitmapText(16, 40, 'fat-and-tiny', '0', 32);
        this.scoreText.smoothed = false;
        this.scoreText.tint = 0xffffff;
		this.scoreText.x = 50;
		this.scoreText.anchor.set(0.5);

		this.shadowStartBridge = this.game.add.sprite(this.game.world.centerX,this.INITIAL_POS_Y_START + 64,this.SHADOW_START_BRIDGE);
		this.shadowStartBridge.anchor.set(0.5);

		this.bonusGroup = this.game.add.group();
		this.bonusGroup.physicsBodyType = Phaser.Physics.ARCADE;
		this.bonusGroup.y = this.INITIAL_POS_Y_FLAGS;
		this.bonusGroup.enableBody = true;

		this.addCharacter();
		
		this.enemiesGroup = this.game.add.group();
		this.enemiesGroup.physicsBodyType = Phaser.Physics.ARCADE;
		this.enemiesGroup.y = this.INITIAL_POS_Y_ENEMIES;
		this.enemiesGroup.enableBody = true;

		/*this.itemsGroup = this.game.add.group();
		this.itemsGroup.physicsBodyType = Phaser.Physics.ARCADE;
		this.itemsGroup.y = this.game.height;
		this.itemsGroup.enableBody = true;*/

		this.getLevelDistance();

		this.startBridge = this.game.add.sprite(this.game.world.centerX,this.INITIAL_POS_Y_START,this.START_BRIDGE);
		this.startBridge.anchor.set(0.5);
		
		this.addCountdown();
	},
	addCountdown: function() {
		this.countdown1 = this.game.add.sprite(this.game.world.centerX, this.game.height/2, this.COUNTDOWN_1);
		this.countdown1.anchor.set(0.5);
		this.countdown1.alpha = 0;

		this.countdown2 = this.game.add.sprite(this.game.world.centerX, this.game.height/2, this.COUNTDOWN_2);
		this.countdown2.anchor.set(0.5);
		this.countdown2.alpha = 0;

		this.countdown3 = this.game.add.sprite(this.game.world.centerX, this.game.height/2, this.COUNTDOWN_3);
		this.countdown3.anchor.set(0.5);
		this.countdown3.alpha = 0;

		this.countdownGo = this.game.add.sprite(this.game.world.centerX, this.game.height/2, this.COUNTDOWN_GO);
		this.countdownGo.anchor.set(0.5);
		this.countdownGo.alpha = 0;

		this.timerToStartCountdown = this.game.time.create(false);
		this.timerToStartCountdownEvent = this.timerToStartCountdown.add(Phaser.Timer.SECOND, this.startCountdown, this);
		this.timerToStartCountdown.start();
	},
	startCountdown: function() {
		this.countdown3.alpha = 1;
		this.timerToStartCountdown.stop();

		this.timerCountdown = this.game.time.create(false);
		this.timerCountdown.loop(1000, this.endCountdownTimer, this);
		this.timerCountdown.start();

		this.cowntdownSound.play();
	},
	endCountdownTimer: function() {
		this.tickCountdown++;
		
		if(this.tickCountdown==1) {
			this.countdown3.kill();
			this.countdown2.alpha = 1;
			this.cowntdownSound.play();
		} else if(this.tickCountdown==2) {
			this.countdown2.kill();
			this.countdown1.alpha = 1;
			this.cowntdownSound.play();
		} else if(this.tickCountdown==3) {
			this.countdown1.kill();
			this.countdownGo.alpha = 1;
			this.cowntdownSoundGo.play();
		} else if(this.tickCountdown==4) {
			this.countdownGo.kill();
			this.startGame = true;
			
			this.timerCountdown.stop();

			this.timerGame = this.game.time.create(false);
			this.timerGame.loop(1000, this.onGameTimer, this);
			this.timerGame.start();

			this.timerReleaseItems = this.game.time.create(false);
			this.timerReleaseItems.loop(this.TIME_RELEASE_ITEMS,this.releaseItem,this);
			this.timerReleaseItems.start();

			//this.timerReleaseFlags = this.game.time.create(false);
			//this.timerReleaseFlags.loop(300,this.releaseEnemy,this);
			//this.timerReleaseFlags.start();
		}
	},
	onGameTimer: function() {
		this.gameTime++;
		if(this.gameTime % this.LEVEL_TIME == 0) {
			this.level++;
			this.currentSpeed += this.aceleration;
			this.getLevelDistance();			
		} 
	},
	getLevelDistance: function() {
		var desiredLevelDistance = this.game.camera.y + (this.currentSpeed * this.fps * this.LEVEL_TIME);
		/*console.log("-----");
		console.log("Nivel " + this.level);
		console.log("camara pos y " + this.game.camera.y);
		console.log("currentSpeed " + this.currentSpeed);
		console.log("aceleration " + this.aceleration);
		console.log("tiempo por nivel " + this.LEVEL_TIME);
		console.log("Proxima distancia " + desiredLevelDistance);
		console.log("Altura del world " + this.game.world.height);*/
		this.game.world.resize(this.STAGE_WIDTH, this.game.world.height + desiredLevelDistance);
		//this.releaseEnemies(this.game.camera.y, desiredLevelDistance);
		//this.releaseFlags(this.game.camera.y, desiredLevelDistance);
		//console.log("Enemigos: " + this.enemiesGroup.length, " flags: ", this.bonusGroup.length);		
	},
	generateRandoms: function(total,totalTypes) {
		var tmp = [];
		for(var i=0; i<total;i++){
			tmp.push(Math.floor((Math.random() * totalTypes) + 1) - 1);
		}
		return tmp;
	},
	addCharacter: function() {
		this.character = this.game.add.sprite(this.game.world.centerX,this.INITIAL_POS_Y_SKI,this.CHARACTER);
		this.game.physics.enable(this.character, Phaser.Physics.ARCADE);

		this.character.name = "spaceNav";
		this.character.anchor.set(0.5);
		this.character.body.setSize(35, 15, 0, 40);		
		
		this.character.body.collideWorldBounds = true;
		this.character.body.bounce.setTo(0.3);

		this.character.animations.add('movement');
    	this.character.animations.play('movement', 5, true);
		
	},
	releaseItem: function() {
		if(this.lastItem) {
			if(this.lastItem.y < this.game.camera.y) {
				this.lastItem.kill();
			}
		}
		this.distance = this.game.camera.y - this.lastCameraY;
		//var type = this.rnd.pick([this.FLAGS_1, this.FLAGS_2]);
		var type = this.rnd.pick([this.BUILDING_CORNER, this.HAZARD, this.RUIN, this.TENTACLES, this.TOWER, this.BROKEN_TOWER, this.FLAGS_1, this.FLAGS_2]);
		var posX = this.game.rnd.integerInRange(0,this.game.width);
		var posY = this.game.camera.y + this.distance + this.lastItemHeight;
		var newPosY = (this.game.camera.y < this.lastItemPosY) ? this.lastItemPosY + this.distance + this.lastItemHeight : posY;
		var item;
		if(type == this.TENTACLES || type == this.TOWER || type == this.BROKEN_TOWER || type == this.BUILDING_CORNER || type == this.RUIN || type == this.HAZARD ) {
			item = this.enemiesGroup.create(posX, posY, type);
		}  

		if(type == this.FLAGS_1 || type == this.FLAGS_2){
			item = this.bonusGroup.create(posX, posY, type);
			item.animations.add(this.TURN_ON_LIGHTS);
		}		
		item.anchor.set(0,0);
       	var newPosX = this.getPosX(this.lastItemPosX, this.lastItemPosX + this.lastItemWidth, posX); 
      	item.x = (newPosX + item.width > this.game.width) ? this.game.width - item.width : newPosX;
       	item.y = newPosY; 
       	item.name = type;
       	item.body.collideWorldBounds = true;

       	switch(item.name) {
       		case this.TENTACLES:
       			item.body.setSize(105,10,28,106);
       			break;
       		case this.TOWER:
       			item.body.setSize(44,18,10,147);
       			break;
       		case this.BROKEN_TOWER:
       			item.body.setSize(44,18,10,147);
       			break;
       		case this.BUILDING_CORNER:
       			item.body.setSize(62,20,18,30);
       			break;
       		case this.RUIN:
       			item.body.setSize(76,20,26,40);
       			break;
       		case this.HAZARD:
       			item.body.setSize(35,21,8,50);
       			break;
       		case this.FLAGS_1:
       			item.body.setSize(126,21,8,1);
       			break;	
       		case this.FLAGS_2:
       			item.body.setSize(66,20,8,1);
       			break;	
       	}
		
       	item.body.immovable = true;

       	this.lastItem = item;
       	this.lastItemName = item.name;
       	this.lastItemPosX = item.x;
       	this.lastItemPosY = item.y;
       	this.lastItemWidth = item.width;
       	this.lastItemHeight = item.height;
       	this.lastCameraY = this.game.camera.y;
	},
	releaseEnemies: function(y,yDistance) {
		// reset enemies
		this.enemiesGroup.forEachAlive(function(e){
			if(e.y < (y - this.game.height)) {
				e.kill();
			} else { }
		},this);

		var randomY;
		var enemy;
		this.randomEnemies = this.generateRandoms(this.TOTAL_ENEMIES_FOR_LEVEL,this.TYPE_OF_ENEMIES.length);

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
	},
	releaseFlags: function(y,yDistance) {
		// reset flags
		this.bonusGroup.forEachAlive(function(e){
			if(e.y < (y - this.game.height)) {
				e.kill();
			} else { }
		},this);

		var bonus;
		var randomY;
		this.randomFlags = this.generateRandoms(this.TOTAL_BONUS_FOR_LEVEL,this.TYPE_OF_BONUS.length);

		window._.each(this.randomFlags,function(ind){
    		randomY = Math.floor(Math.random() * (yDistance - y)) + y;
    		bonus = this.bonusGroup.create(this.game.world.randomX, randomY + this.game.height,  this.TYPE_OF_BONUS[ind].name, this.game.rnd.integerInRange(0, 36));
	       	bonus.name = this.TYPE_OF_BONUS[ind].name;
	       	bonus.body.setSize(this.TYPE_OF_BONUS[ind].w-42,10,0,0);
			bonus.anchor.set(0.5);
	       	bonus.animations.add(this.TURN_ON_LIGHTS);
		},this);
	},
	getPosX: function(n1,n2,n3) {
		return (n3 >= n1 && n3 <= n2) ? n2 : n3;
	},
	update: function() {
		if(!this.startGame) return;

		this.fps = this.game.time.fps;

		if (!this.character.alive)
        {
            this.character.body.velocity.x = 0;
            this.timerReleaseItems.stop();
            return;
        }
		
		// Mouse
		var d = this.physics.arcade.distanceToXY(this.character, this.input.activePointer.x, this.character.y) * 2;

        if (this.input.x < this.character.x - 20) {
            this.character.body.velocity.x = -d;
        } else if (this.input.x > this.character.x + 20) {
            this.character.body.velocity.x = d;
        } else { }

        // Keyboard
		/*if(this.rightKey.isDown) {
			this.character.body.velocity.x += (this.currentSpeed + 7);
			this.character.angle = -20;
		} else if (this.leftKey.isDown) {
			this.character.body.velocity.x -= (this.currentSpeed + 7);
			this.character.angle = 20;
		} else if(this.downKey.isDown) {
		} else {
			this.character.angle = 0;
		}*/

		//this.distance = this.currentSpeed * this.game.time.fps * this.LEVEL_TIME;

        this.game.camera.y += this.currentSpeed;
		this.character.y = this.game.camera.y + this.INITIAL_POS_Y_SKI;
		
		this.scoreText.y = this.game.camera.y + 40;
		this.waves.y = this.game.camera.y;
		this.backgroundOverlap.y = this.game.camera.y;
		this.waves.tilePosition.y-=this.currentSpeed;		


		this.game.physics.arcade.overlap(this.character, this.enemiesGroup, this.getEnemyOverlap, this.overlapHandler, this);
		this.game.physics.arcade.overlap(this.character, this.bonusGroup, this.getBonusCollision, this.overlapHandler, this);
		//this.game.physics.arcade.overlap(this.character, this.itemsGroup, this.getItemCollision, this.overlapHandler, this);
	},
	render: function() {
		if(this.isDebug) {
			this.game.debug.cameraInfo(this.game.camera, 32, 32);
			this.game.debug.body(this.character);
			
			this.enemiesGroup.forEachAlive(function(enemy){
			    this.game.debug.body(enemy);
			},this);

			this.bonusGroup.forEachAlive(function(bonus){
			    this.game.debug.body(bonus);
			},this);
		}
	},
	overlapHandler: function(character,enemy) {
		return (enemy.key == this.TENTACLES || 
				enemy.key == this.TOWER ||
				enemy.key == this.BROKEN_TOWER ||
				enemy.key == this.BUILDING_CORNER ||
				enemy.key == this.RUIN ||
				enemy.key == this.HAZARD ||
				enemy.key == this.FLAGS_1 ||
				enemy.key == this.FLAGS_2
				);
	},
	getEnemyOverlap: function(character,enemy) {
		enemy.body.destroy();
		this.character.alive = false;
		this.jetSkiSound.pause();
		this.timerGame.stop();
		this.game.sound.play('crash');
	},
	getBonusCollision: function(character,bonus) {
		bonus.animations.play(this.TURN_ON_LIGHTS, 60, false);
		var typeOfBonus = window._.filter(this.TYPE_OF_BONUS,function(b){
			return b.name == bonus.name;
		});
		this.score += typeOfBonus[0].points;
		this.game.sound.play('hit-object');
		this.scoreText.text = this.score;
		bonus.body.destroy();
	},
	getItemCollision: function(character,item) {
		if(item.name == this.TENTACLES || item.name == this.TOWER || item.name == this.BROKEN_TOWER	|| item.name == this.BUILDING_CORNER || item.name == this.RUIN || item.name == this.HAZARD ) {
			item.body.destroy();
			this.character.alive = false;
			this.jetSkiSound.pause();
			this.timerGame.stop();
			this.game.sound.play('crash');
		} 
		if(item.name == this.FLAGS_1 || item.name == this.FLAGS_2){
			item.animations.play(this.TURN_ON_LIGHTS, 60, false);
			var typeOfBonus = window._.filter(this.TYPE_OF_BONUS,function(b){
				return b.name == item.name;
			});
			this.score += typeOfBonus[0].points;
			this.game.sound.play('hit-object');
			this.scoreText.text = this.score;
			item.body.destroy();
		}		
	}
};