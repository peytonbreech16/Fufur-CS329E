var playAgain1

class YouWin extends Phaser.Scene{
  constructor(){
    super({key:'YouWin'});
  }

  preload(){
    this.load.image('back1', 'assets/background1.png');
    this.load.image('back2', 'assets/background2.png');
    this.load.image('back3', 'assets/background3.png');
    this.load.image('back4', 'assets/background4.png');
    this.load.image('back5', 'assets/background5.png');
    this.load.image('back6', 'assets/background6.png');
    this.load.image('youWon', 'assets/text/youWon.png');
    this.load.image('playAgain', 'assets/text/playAgain.png');
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

    this.add.image(400,90,'youWon').setScale(.9);

    playAgain1 = this.add.image(400,200,'playAgain').setScale(.75);
    playAgain1.setInteractive({useHandCursor: true});
    playAgain1.on('pointerdown', function() {
      location.reload();
      return false;
    }, this);
  }

  update(){
    playAgain1.on('pointerover', function() {
      playAgain1.setTintFill(0x450000);
    }, this);

    playAgain1.on('pointerout', function() {
      playAgain1.clearTint();
    }, this);
  }

}
