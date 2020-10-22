var backButton;
var playButton2;
var instrPlayer;

class Instructions extends Phaser.Scene{
  constructor(){
    super({key:'Instructions'});
  }

  preload(){
    this.load.image('back1', 'assets/background1.png');
    this.load.image('start', 'assets/text/start.png');
    this.load.image('back', 'assets/text/back.png');
    this.load.image('inst1', 'assets/text/instructions1.png');
    this.load.image('inst2', 'assets/text/instructions2.png');
    this.load.image('inst3', 'assets/text/instructions3.png');
    this.load.image('moveInstr', 'assets/text/movementInstr.png');
    this.load.image('guideInstr1', 'assets/text/guideInstr1.png');
    this.load.image('guideInstr2', 'assets/text/guideInstr2.png');
    this.load.image('piecesInstr1', 'assets/text/piecesInstr1.png');
    this.load.image('piecesInstr2', 'assets/text/piecesInstr2.png');
    this.load.image('saltRock', 'assets/saltRock.png');
    this.load.image('candleOff', 'assets/candleOff.png');
    this.load.image('iron', 'assets/iron.png');
    this.load.spritesheet('guide', 'assets/guide.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 64, frameHeight: 64 });
  }

  create(){

    // background and buttons
    var back1 = this.add.image(400,300,'back1');
    back1.displayWidth = game.config.width * 1;
    back1.scaleY = back1.scaleX;

    playButton2 = this.add.image(340,540,'start').setScale(.8);
    playButton2.setInteractive({useHandCursor: true});
    playButton2.on('pointerdown', function() {
      this.scene.switch('Scene1');
    }, this);

    backButton = this.add.image(460,540,'back').setScale(.8);
    backButton.setInteractive({useHandCursor: true});
    backButton.on('pointerdown', function() {
      this.scene.switch('StartScreen');
    }, this);

    // text
    this.add.image(400,90,'inst1').setScale(.8);
    this.add.image(400,125,'inst2').setScale(.8);
    this.add.image(400,160,'inst3').setScale(.8);

    this.add.image(370, 260, 'moveInstr');

    this.add.image(330, 330, 'guideInstr1').setScale(.65);
    this.add.image(330, 355, 'guideInstr2').setScale(.65);

    this.add.image(330, 420, 'piecesInstr1').setScale(.65);
    this.add.image(330, 445, 'piecesInstr2').setScale(.65);

    // static player for instructions
    instrPlayer = this.physics.add.sprite(640, 250, 'player');

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'player', frame: 14 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
        frameRate: 10,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
    wasd = this.input.keyboard.addKeys(
        {up:Phaser.Input.Keyboard.KeyCodes.W,
        left:Phaser.Input.Keyboard.KeyCodes.A,
        down:Phaser.Input.Keyboard.KeyCodes.S,
        right:Phaser.Input.Keyboard.KeyCodes.D});

    // spirit guide animations
    var instrGuide = this.physics.add.sprite(640, 320, 'guide').setScale(1.7);

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('guide', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });

    instrGuide.anims.play('idle', true);

    // sealing pieces
    this.add.image(580, 435, 'saltRock').setScale(1.6);
    this.add.image(620, 435, 'iron').setScale(1.6);
    this.add.image(660, 435, 'candleOff').setScale(1.6);
  }

  update(){
    // button interactives
    playButton2.on('pointerover', function() {
      playButton2.setTintFill(0x450000);
    }, this);

    playButton2.on('pointerout', function() {
      playButton2.clearTint();
    }, this);

    backButton.on('pointerover', function() {
      backButton.setTintFill(0x450000);
    }, this);

    backButton.on('pointerout', function() {
      backButton.clearTint();
    }, this);

    // show player animations
    instrPlayer.setVelocityX(0);
    instrPlayer.setVelocityY(0);

    // player movement
    if (cursors.left.isDown || wasd.left.isDown)
    {
        instrPlayer.anims.play('left', true);
        instrPlayer.setScale(1.4);
    }
    else if (cursors.right.isDown || wasd.right.isDown)
    {
        instrPlayer.anims.play('right', true);
        instrPlayer.setScale(1.4);
    }
    else if (cursors.up.isDown || wasd.up.isDown)
    {
        instrPlayer.anims.play('up', true);
        instrPlayer.setScale(1.4);
    }

    else if (cursors.down.isDown || wasd.down.isDown)
    {
        instrPlayer.anims.play('down', true);
        instrPlayer.setScale(1.4);
    }

    else
    {
        instrPlayer.anims.play('turn');
        instrPlayer.setScale(1.4);
    }
  }
}
