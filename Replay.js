class Replay extends Phaser.Scene{
  constructor(){
    super({key:'Replay'});
  }

  create(){

    this.add.text(300,200, 'Game Over!',{fontSize: 40, color: "#000000"});

    var playAgainButton = this.add.text(320,250,'Play Again',{fontSize: 30, color: "#000000", backgroundColor: '#808080'});
    playAgainButton.setInteractive({useHandCursor: true});
    playAgainButton.on('pointerdown', function() {
      location.reload();
      return false;
    }, this);
  }
}
