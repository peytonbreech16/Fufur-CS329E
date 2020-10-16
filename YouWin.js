class YouWin extends Phaser.Scene{
  constructor(){
    super({key:'YouWin'});
  }

  create(){

    this.add.text(300,200, 'You trapped Furfur. You Won!',{fontSize: 40, color: "#000000"});

    var playAgainButton = this.add.text(320,250,'Play Again',{fontSize: 30, color: "#000000", backgroundColor: '#808080'});
    playAgainButton.setInteractive({useHandCursor: true});
    playAgainButton.on('pointerdown', function() {
      location.reload();
      return false;
    }, this);
  }
}
