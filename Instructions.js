var backButton;
var playButton2;
var instrPlayer;

class Instructions extends Phaser.Scene{
  constructor(){
    super({key:'Instructions'});
  }

  preload(){
    this.load.image('back1', 'assets/background1.png');
    this.load.image('saltRock', 'assets/saltRock.png');
    this.load.image('candleOff', 'assets/candleOff.png');
    this.load.image('iron', 'assets/iron.png');
    this.load.image('orb', 'assets/orb.png');
    this.load.spritesheet('guide', 'assets/guide.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('protect', 'assets/protection.png', { frameWidth: 128, frameHeight: 128 });
  }

  create(){

    // background and buttons
    var back1 = this.add.image(400,300,'back1');
    back1.displayWidth = game.config.width * 1;
    back1.scaleY = back1.scaleX;

    playButton2 = this.add.text(320,515,'Start',{fontFamily:'Curse',fontSize:45,fill:"#856f6f"});
    playButton2.setInteractive({useHandCursor: true});
    playButton2.on('pointerdown', function() {
      this.scene.switch('Scene1');
    }, this);

    backButton = this.add.text(425,515,'Back',{fontFamily:'Curse',fontSize:45,fill:"#856f6f"});
    backButton.setInteractive({useHandCursor: true});
    backButton.on('pointerdown', function() {
      this.scene.switch('StartScreen');
    }, this);

    // text
    this.add.text(130,15,"You're trapped in Furfur's demonic forest.",{fontFamily:'Headache',fontSize:22,fill:"#856f6f"});
    this.add.text(20,42,"Collect all the sealing pieces to send Furfur back to Hell.",{fontFamily:'Headache',fontSize:22,fill:"#856f6f"});
    this.add.text(122,69,"If Furfur catches you, your fate is sealed.",{fontFamily:'Headache',fontSize:22,fill:"#856f6f"});

    this.add.text(120,160,'Use WASD or arrow keys to explore the forest.',{fontFamily:'Headache',fontSize:18,fill:"#856f6f"});

    this.add.text(70,230,'Your spirit guide will help you on your journey.',{fontFamily:'Headache',fontSize:18,fill:"#856f6f"});
    this.add.text(69,255,"Press 'ENTER' to interact with your spirit guide.",{fontFamily:'Headache',fontSize:18,fill:"#856f6f"});

    this.add.text(110,320,"Collect all the salt, iron, and candle pieces,",{fontFamily:'Headache',fontSize:18,fill:"#856f6f"});
    this.add.text(125,345,"and return them to your spirit guide.",{fontFamily:'Headache',fontSize:18,fill:"#856f6f"});

    this.add.text(20,410,"Spirit orbs grant you temporary immunity from Furfur.",{fontFamily:'Headache',fontSize:18,fill:"#856f6f"});
    this.add.text(65,435,"They are a limited resource, so use them wisely.",{fontFamily:'Headache',fontSize:18,fill:"#856f6f"});
    this.add.text(145,460,"Press 'SPACE' to use a spirit orb.",{fontFamily:'Headache',fontSize:18,fill:"#856f6f"});

    // static player for instructions
    instrPlayer = this.physics.add.sprite(670, 160, 'player');

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
    var instrGuide = this.physics.add.sprite(670, 230, 'guide').setScale(1.7);

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('guide', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });

    instrGuide.anims.play('idle', true);

    // sealing pieces
    this.add.image(600, 345, 'saltRock').setScale(1.6);
    this.add.image(640, 345, 'iron').setScale(1.6);
    this.add.image(680, 345, 'candleOff').setScale(1.6);

    // orb
    this.add.image(630, 445, 'orb').setScale(1.5);

    // protection animation
    var instrPlayer2 = this.add.sprite(720,440, 'player');
    instrPlayer2.anims.play('turn', true);
    var instrProtection = this.physics.add.sprite(720, 440, 'protect');

    this.anims.create({
      key:'on',
      frames: this.anims.generateFrameNumbers('protect', { start: 0, end: 3 }),
      frameRate: 12,
      repeat: -1
    });

    instrProtection.anims.play('on', true);
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
