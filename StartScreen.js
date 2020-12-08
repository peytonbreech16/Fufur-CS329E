var playButton1;
var howToButton;
var creditsButton;

class StartScreen extends Phaser.Scene{
  constructor(){
    super({key:'StartScreen'});
  }

  preload(){
    this.load.image('back1', 'assets/background1.png');
    this.load.image('back2', 'assets/background2.png');
    this.load.image('back3', 'assets/background3.png');
    this.load.image('back4', 'assets/background4.png');
    this.load.image('back5', 'assets/background5.png');
    this.load.image('back6', 'assets/background6.png');
  }

  create(){

    var back1 = this.add.image(400,300,'back1');
    back1.displayWidth = game.config.width * 1;
    back1.scaleY = back1.scaleX;

    var back2 = this.add.image(400,300,'back2');
    back2.displayWidth = game.config.width * 1;
    back2.scaleY = back2.scaleX;

    var back3 = this.add.image(400,300,'back3');
    back3.displayWidth = game.config.width * 1;
    back3.scaleY = back3.scaleX;

    var back4 = this.add.image(400,300,'back4');
    back4.displayWidth = game.config.width * 1;
    back4.scaleY = back4.scaleX;

    var back5 = this.add.image(400,300,'back5');
    back5.displayWidth = game.config.width * 1;
    back5.scaleY = back5.scaleX;

    var back6 = this.add.image(400,300,'back6');
    back6.displayWidth = game.config.width * 1;
    back6.scaleY = back6.scaleX;

    this.add.text(300,5,'Furfur',{fontFamily:'Curse',fontSize:120,fill:"#856f6f"});

    playButton1 = this.add.text(360,150,'Start',{fontFamily:'Curse',fontSize:64,fill:"#856f6f"});
    playButton1.setInteractive({useHandCursor: true});
    playButton1.on('pointerdown', function() {
      this.scene.start('Scene1');
    }, this);

    howToButton = this.add.text(315,225,'How to Play',{fontFamily:'Curse',fontSize:64,fill:"#856f6f"});
    howToButton.setInteractive({useHandCursor: true});
    howToButton.on('pointerdown', function() {
      this.scene.switch('Instructions');
    }, this);

    creditsButton = this.add.text(345,300,'Credits',{fontFamily:'Curse',fontSize:64,fill:"#856f6f"});
    creditsButton.setInteractive({useHandCursor: true});
    creditsButton.on('pointerdown', function() {
      this.scene.switch('Credits');
    }, this);
  }

  update(){
    playButton1.on('pointerover', function() {
      playButton1.setTintFill(0x450000);
    }, this);

    playButton1.on('pointerout', function() {
      playButton1.clearTint();
    }, this);

    howToButton.on('pointerover', function() {
      howToButton.setTintFill(0x450000);
    }, this);

    howToButton.on('pointerout', function() {
      howToButton.clearTint();
    }, this);

    creditsButton.on('pointerover', function() {
      creditsButton.setTintFill(0x450000);
    }, this);

    creditsButton.on('pointerout', function() {
      creditsButton.clearTint();
    }, this);
  }
}
