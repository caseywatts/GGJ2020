import inRange from '../lib/inRange';
import callText from '../lib/callText.js';
import configText from '../lib/configText';
import displayInteractText from '../lib/displayInteractText';
import coordinates from '../lib/coordinates';
import drRedNoseCharacter from '../characters/DrRedNose';
import playerCharacter from '../characters/player';
import ghostCharacter from '../characters/ghost';
import setupPlayerMovement from '../lib/setupPlayerMovement';
import setupDialog from '../lib/setupDialog';

export class SimpleScene extends Phaser.Scene {

  preload () {
    this.load.image('bg', 'assets/bg.png');
    this.load.image('wall', 'assets/wall.png');
    this.load.audio('main_background_music', ['assets/the little robot that could.ogg']);
    this.load.audio('victory_music', ['assets/the little robot that won.ogg']);
    this.load.audio('steps', ['assets/Steps.mp3']);
    this.load.audio('spooky', ['assets/spooookieeee.mp3']);
    this.load.image('winSquare', 'assets/npc.png');
    this.load.image('playerBase', 'assets/player_base.png');
    this.load.multiatlas('allSprites', 'assets/ggj2020.json', 'assets');
    this.load.image("coyMapTilesImage", "assets/coy-map-tiles.png");
    this.load.tilemapTiledJSON("omegaBuilding", "assets/Omega Building.json");
  }

  create () {
    this.setupMusic();
    this.displayHelpText();
    this.setupMap();

    this.ghost = ghostCharacter(this, ...coordinates(10, 15));
    this.drRedNose = drRedNoseCharacter(this, ...coordinates(9.1, 17));
    this.player = playerCharacter(this, ...coordinates(10, 17));
    this.winSquare = this.physics.add.sprite(...coordinates(23, 3), 'winSquare');

    //The things the player can interact with in the game.  When the player is nearby, they'll be prompted with help text.
    var interactables = [this.drRedNose, this.winSquare];
    for(var i = 0; i < interactables.length; i++){
      this.physics.add.overlap(this.player, interactables[i], () => {
        displayInteractText(this, this.cameras);
      }, null, true);
    }

    

    // set up interactions between things
    this.physics.add.collider(this.player, this.wallsLayer);

    setupPlayerMovement(this, this.player, this.steps);

    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);


    this.input.keyboard.on('keydown_SPACE', (event) => {
      if (inRange(this.player, this.winSquare)) {
        this.displayWinText();
      }
    });

    setupDialog(this);
  }

  update (time,delta) {
    // follow character
    this.cameras.main.centerOn(this.player.x, this.player.y)
  }

  displayWinText() {
    var winningText = this.add.text(700, 100, 'Winner!');
    winningText.setStroke('#000', 8);
    winningText.setShadow(2, 2, "#333333", 2, true, true);
    callText(winningText, 'Winner!');

    this.player.healed = true;
    this.backgroundMusic.stop();
    victoryTheme(this);

    //DISABLECONTROLS HERE
  }

  setupMusic() {
    this.backgroundMusic = this.sound.add('main_background_music');
    this.steps = this.sound.add('steps');
    this.spooky = this.sound.add('spooky');

    // this.backgroundMusic.play({loop: true});
  }

  displayHelpText() {
    // Help text that has a "fixed" position on the screen
    this.add
      .text(20, 16, "Arrow keys to scroll", {
        font: "18px monospace",
        fill: "#ffffff",
        padding: { x: 20, y: 10 },
        backgroundColor: "#000000"
      })
      .setScrollFactor(0);
  }



  setupMap() {
    this.map = this.make.tilemap({ key: "omegaBuilding" });

    const tileset = this.map.addTilesetImage('coy-map-tiles', 'coyMapTilesImage');
    this.wallsLayer = this.map.createStaticLayer("Omega Building Main Layer", tileset, 0, 0);
    this.wallsLayer.setCollisionByProperty({ collide: true });
  }
}

function victoryTheme(scene) {
  const victoryMusic = scene.sound.add('victory_music');
  victoryMusic.play();
}