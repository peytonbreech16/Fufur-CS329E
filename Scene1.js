var player;
var furfur;
var hitbox;
var cursors;
var wasd;
var gameOver = false;
var trees;
var puzzlePieces;
var collectedPieces = 0;
var scoreText;
var topBorder;
var bottomBorder;
var leftBorder;
var rightBorder;
var playerX;
var playerY;
var backgroundMusic
var furfurSpawned = false; // is furfur chasing
var roomsTraversed = 0; // number of rooms furfur has followed you for
var prevRoom; // room the player was previously in
var musicPlaying = false;
var furfurMusic;
var pickUpSFX;
var candleSFX;
var ironSFX;
var saltSFX;
var protection; // protection animation
var isProtected = false; // can player can phase through furfur
var protTimerOn = false; // is the timer running
var protTime = 10; // 5 second protection
var protTimeCounter; // setInterval() object
var numOrbs = 0;
var orbs;
var orbText;
var space;
var sigil;
var itemCollected1 = false;
var itemCollected2 = false;
var itemCollected3 = false;
var orbCollected = false;
var sigilOn = false;
var candlesOn;

class Scene1 extends Phaser.Scene
{
    constructor()
    {
        super("Scene1");
    }

    init(data)
    {
        // track spawn coordinates
        if (data.x == undefined)
        {
            this.playerSpawnX = 600;
            this.playerSpawnY = 550;
        }
        else
        {
            this.playerSpawnX = data.x;
            this.playerSpawnY = data.y;
        }
    }


    preload()
    {
        this.load.spritesheet('dude', 'assets/player.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('furfur', 'assets/demon.png', {frameWidth: 200, frameHeight: 155});
        this.load.spritesheet('protect', 'assets/protection.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('sigil', 'assets/furfurSigil.png', {frameWidth: 512, frameHeight: 512});
        this.load.spritesheet('candleOn', 'assets/candle.png', {frameWidth: 24, frameHeight: 24});
        this.load.spritesheet('guide', 'assets/guide.png', { frameWidth: 128, frameHeight: 128 });
        this.load.image('ground','assets/ground.png');
        this.load.image('tallTree','assets/tallTree.png');
        this.load.image('wideTree','assets/wideTree.png');
        this.load.audio('BackgroundMusic',['assets/BackgroundMusic2.mp3']);
        this.load.audio('FurfurMusic',['assets/FurfurMusic.mp3']);
        this.load.audio('pickUp',['assets/PickUp_1.wav']);
        this.load.image('salt', 'assets/saltRock.png');
        this.load.image('medRock', 'assets/medRock.png');
        this.load.image('largeRock', 'assets/largeRock.png');
        this.load.image('bigStump', 'assets/bigStump.png');
        this.load.image('log', 'assets/log.png');
        this.load.image('orb', 'assets/orb.png');
        this.load.image('hPath', 'assets/horizStonePath.png');
        this.load.image('vPath', 'assets/vertStonePath.png');
        this.load.image('dirt', 'assets/dirtPatch.png');
        this.load.image('grass', 'assets/grassPatch.png');
        this.load.image('hitbox', 'assets/hitbox.png');
    }

    create()
    {
        // add ground
        var background = this.add.image(400,350,'ground');
        background.displayWidth = game.config.width * 1;
        background.scaleY = background.scaleX;

        //background music
        backgroundMusic = this.sound.add('BackgroundMusic');
        backgroundMusic.setVolume(.30);
        furfurMusic = this.sound.add('FurfurMusic');
        furfurMusic.setVolume(.30);
        this.playMusic(backgroundMusic);

        //sound effects
        pickUpSFX = this.sound.add('pickUp');
        pickUpSFX.setVolume(.50);

        // add trees
        trees = this.physics.add.staticGroup();
        puzzlePieces = this.physics.add.staticGroup();
        trees.create(10,52,'tallTree');
        trees.create(100,52,'tallTree');
        trees.create(190,52,'tallTree');

        var tree1 = trees.create(280,52,'tallTree');
        tree1.body.setCircle(50);
        tree1.body.setOffset(-10, 40);

        var tree2 = trees.create(523,52,'tallTree');
        tree2.body.setCircle(50);
        tree2.body.setOffset(0, 40);

        trees.create(600,52,'tallTree');
        trees.create(689,52,'tallTree');
        trees.create(780,52,'tallTree');
        trees.create(30,145,'tallTree');
        trees.create(25,250,'tallTree');
        trees.create(35,365,'tallTree');
        trees.create(25,480,'tallTree');
        trees.create(75,525,'tallTree');

        var tree3 = trees.create(775,480,'tallTree');
        tree3.body.setCircle(50);
        tree3.body.setOffset(0, 20);

        var tree4 = trees.create(725,525,'tallTree');
        tree4.body.setCircle(50);
        tree4.body.setOffset(0, 20);

        var tree5 = trees.create(770,145,'tallTree');
        tree5.body.setCircle(50);
        tree5.body.setOffset(0, 40);

        this.anims.create({
            key: 'candles_on',
            frames: this.anims.generateFrameNumbers('candleOn', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.add.image(100,160,'vPath').setScale(1.3);
        this.add.image(140,160,'vPath').setScale(1.3);
        this.add.image(180,160,'vPath').setScale(1.3);
        this.add.image(220,160,'vPath').setScale(1.3);
        var path = this.add.image(100,200,'vPath').setScale(1.3);
        path.flipY = true;
        path = this.add.image(140,200,'vPath').setScale(1.3);
        path.flipY = true;
        path = this.add.image(180,200,'vPath').setScale(1.3);
        path.flipY = true;
        path = this.add.image(220,200,'vPath').setScale(1.3);
        path.flipY = true;
        this.add.image(160,260,'vPath').setScale(1.3);
        this.add.image(160,300,'vPath').setScale(1.3);
        this.add.image(210,300,'hPath').setScale(1.3);
        this.add.image(250,300,'hPath').setScale(1.3);

        this.add.image(210,500,'dirt').setScale(1.5);
        this.add.image(190,480,'dirt').setScale(1.5);
        this.add.image(650,180,'dirt');

        var grass = this.add.image(580,160,'grass');
        grass.flipX = true;
        grass = this.add.image(470,460,'grass');
        grass.flipX = true;
        grass.flipY = true;
        this.add.image(750,400,'grass');

        sigil = this.add.sprite(400,300,'sigil');
        sigil.setVisible(false);
        sigil.setScale(.75)

        this.anims.create({
            key: 'sigil_on',
            frames: this.anims.generateFrameNumbers('sigil', { start: 0, end: 37 }),
            frameRate: 10,
            repeat: 0
        });

        // condition for sealing circle to appear
        if (collectedPieces >= 3 && !sigilOn)
        {
          this.sigilAnimation();
          this.time.addEvent({
            delay: 3800,
            // spawn furfur
            callback: () =>{
              sigil.setVisible(true);
              sigil.setFrame(37);
              sigilOn = true;
            }
          })
        }

        if (sigilOn){
          sigil = this.add.sprite(400,300,'sigil').setScale(0.75);
          sigil.setFrame(37);
        }

        // The player and its settings
        player = this.physics.add.sprite(this.playerSpawnX, this.playerSpawnY, 'dude');

        //The enemy (furfur) and its settings
        furfur = this.physics.add.sprite(100, 530, 'furfur');
        furfur.setVisible(false);
        furfur.disableBody(true,true);

        // The enemy hit box
        hitbox = this.physics.add.sprite(furfur.x, furfur.y, 'hitbox');
        hitbox.setVisible(false);
        hitbox.disableBody(true,true);

        //  Player and furfur physics properties. Give the little guy a slight bounce.
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        this.physics.add.collider(player, trees);

        //Player touching puzzle pieces
        this.physics.add.overlap(player, puzzlePieces, this.pickUpPiece, null, this);

        //Text for showing how many puzzle pieces collected
        scoreText = this.add.text(20, 20, 'Pieces Collected: ' + collectedPieces + '/3', { fontFamily: 'Headache', fontSize: 22, fill: '#ff0' });

        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 14 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('dude', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('dude', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1
        });

        // spirit guide animations
        var instrGuide = this.physics.add.sprite(150, 150, 'guide').setScale(1.7);

        this.anims.create({
          key: 'idle',
          frames: this.anims.generateFrameNumbers('guide', { start: 0, end: 3 }),
          frameRate: 8,
          repeat: -1
        });

    instrGuide.anims.play('idle', true);
        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();
        wasd = this.input.keyboard.addKeys(
            {up:Phaser.Input.Keyboard.KeyCodes.W,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            right:Phaser.Input.Keyboard.KeyCodes.D});

        // Furfur animations
        this.anims.create({
            key: 'furfur_left',
            frames: this.anims.generateFrameNumbers('furfur', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'furfur_right',
            frames: this.anims.generateFrameNumbers('furfur', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'furfur_up',
            frames: this.anims.generateFrameNumbers('furfur', { start: 9, end: 12 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'furfur_down',
            frames: this.anims.generateFrameNumbers('furfur', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // room change objects

        topBorder = this.add.rectangle(400,0,200,25, 0xFF0000);
        this.physics.add.existing(topBorder);
        this.physics.add.overlap(player, topBorder, this.moveRoomUp, null, this);

        bottomBorder = this.add.rectangle(400,600,550,25, 0xFF0000);
        this.physics.add.existing(bottomBorder);
        this.physics.add.overlap(player, bottomBorder, this.moveRoomDown, null, this);

        rightBorder = this.add.rectangle(800, 300, 25, 250, 0xFF0000);
        this.physics.add.existing(rightBorder);
        this.physics.add.overlap(player, rightBorder, this.moveRoomRight, null, this);

        // furfur is chasing player
        if (furfurSpawned && roomsTraversed < 3){
          this.time.addEvent({
            delay: 1000,

            // spawn furfur
            callback: () =>{
              var x = this.playerSpawnX;
              var y = this.playerSpawnY;
              furfur = this.physics.add.sprite(x, y, 'furfur');
              hitbox.setActive(true).setVisible(false);
              hitbox.body.enable = true;
              furfurSpawned = true;
              this.physics.add.overlap(player, hitbox, this.startOver, null, this);
              furfur.setCollideWorldBounds(true);
            },
          });
          roomsTraversed = roomsTraversed + 1;
        }
        else if (furfurSpawned && roomsTraversed == 3){
          roomsTraversed = 0;
          furfurSpawned = false;
          furfurMusic.stop();
          backgroundMusic.play();
        }

        // furfur won't randomly spawn in room 1_1
        if (!furfurSpawned){
          var randomSpawn = false;

          console.log(randomSpawn);
        }

        // furfur has not yet spawned
        if (!furfurSpawned && randomSpawn){
          var furfurCooldown = Phaser.Math.Between(2000,5000);
          this.time.addEvent({
            delay: furfurCooldown,

            // spawn furfur
            callback: () =>{
              furfur = this.physics.add.sprite(0, 0, 'furfur');
              hitbox = this.physics.add.sprite(0, 0, 'hitbox');
              hitbox.setActive(true).setVisible(false);
              hitbox.body.enable = true;

              //music playing for furfur spawn
              backgroundMusic.stop();
              furfurMusic.play();

              this.physics.add.overlap(player, hitbox, this.startOver, null, this);
              setFurfurCoord();
              furfur.setCollideWorldBounds(true);
              furfurSpawned = true;
            },
          });
        }

        // orbs that grant furfur immunity
        orbs = this.physics.add.staticGroup();
        if (!orbCollected)
        {
          orbs.create(300,150,'orb');
        }

        //Player touching orbs
        this.physics.add.overlap(player, orbs, this.pickUpOrb, null, this);

        //Text for showing how many orbs player can use
        orbText = this.add.text(20, 40, 'Orbs: ' + numOrbs, {fontFamily: 'Headache', fontSize: 22, fill: '#ff0' });

        // protection
        protection = this.physics.add.sprite(playerX, playerY, 'protect');
        protection.setVisible(false);
        protection.disableBody(true,true);

        this.anims.create({
          key:'on',
          frames: this.anims.generateFrameNumbers('protect', { start: 0, end: 3 }),
          frameRate: 12,
          repeat: -1
        });

        space = this.input.keyboard.addKeys(
            {use:Phaser.Input.Keyboard.KeyCodes.SPACE});

    }

    update()
    {
        playerX = player.x;
        playerY = player.y;

        movePlayer();

        moveFurfur();

        if (space.use.isDown && numOrbs != 0)
        {
          isProtected = true;
        }

        if (isProtected && !protTimerOn){
          numOrbs -= 1;
          protTimerOn = true;
          protTimeCounter = setInterval(protTimer, 1000); // countdown e
        }

        if (isProtected){
          protection.setActive(true).setVisible(true);
          protection.anims.play('on', true);
          furfur.body.enable = false;
          moveProtection();
        }

        if (sigilOn)
        {
          var candle1 = this.add.sprite(300,200,'candleOn');
          var candle2 = this.add.sprite(300,400,'candleOn');
          var candle3 = this.add.sprite(500,200,'candleOn');
          var candle4 = this.add.sprite(500,400,'candleOn');
          this.anims.staggerPlay('candles_on',[candle1,candle2,candle3,candle4],500,false);
          
          this.time.addEvent({
            delay: 1500,
            callback: () =>{
              backgroundMusic.stop();
              furfurMusic.stop();
              musicPlaying = false;
              this.scene.switch('YouWin');
            }
          })
        }

    }

    //function for when the game needs to start over
    startOver(player, furfur)
    {
        if (isProtected){
          return;
        }
        else{
          this.scene.switch('Replay');
          backgroundMusic.stop();
          furfurMusic.stop();
          collectedPieces = 0;
          furfurSpawned = false;
          musicPlaying = false;
        }
    }

    //function so that the regular background music does not play on entering each scene
    playMusic(backgroundMusic)
    {
        if (!musicPlaying)
        {
            backgroundMusic.play();
            musicPlaying = true;
        }
    }

    pickUpPiece(player, puzzlePieces)
    {
        puzzlePieces.destroy();
        pickUpSFX.play();
        collectedPieces++;
        if (collectedPieces >= 3)
        {
            //backgroundMusic.stop();
            furfurMusic.stop();
            furfurSpawned = false;
            musicPlaying = false;
        }
        scoreText.setText('Pieces Collected: ' + collectedPieces + '/3');
    }

    pickUpOrb(player, orbs)
    {
      orbs.destroy();
      pickUpSFX.play();
      numOrbs++;
      orbCollected = true;
      orbText.setText('Orbs: ' + numOrbs);
    }


    moveRoomUp(player, topBorder)
    {
        prevRoom = "Scene1";
        this.scene.start("Scene2_1", {x: playerX, y: 550});
    }

    moveRoomDown(player, bottomBorder)
    {
        prevRoom = "Scene1";
        this.scene.start("Scene0_1", {x: playerX, y: 50});
    }

    moveRoomLeft(player, leftBorder)
    {
        prevRoom = "Scene1";
        this.scene.start("Scene1", {x: 750, y: playerY});
    }

    moveRoomRight(player, rightBorder)
    {
        prevRoom = "Scene1";
        this.scene.start("Scene1_2", {x: 50, y: playerY});
    }

    sigilAnimation()
    {
      var candle1 = this.add.sprite(300,200,'candleOn');
      var candle2 = this.add.sprite(300,400,'candleOn');
      var candle3 = this.add.sprite(500,200,'candleOn');
      var candle4 = this.add.sprite(500,400,'candleOn');
      this.anims.staggerPlay('candles_on',[candle1,candle2,candle3,candle4],500,false);

      sigil = this.add.sprite(400,300,'sigil');
      sigil.setScale(.75)
      sigil.anims.play('sigil_on', false);
    }
};


function movePlayer()
    {
        player.setVelocityX(0);
        player.setVelocityY(0);

        // player movement
        if (cursors.left.isDown || wasd.left.isDown)
        {
            player.setVelocityX(-300);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown || wasd.right.isDown)
        {
            player.setVelocityX(300);

            player.anims.play('right', true);
        }
        else if (cursors.up.isDown || wasd.up.isDown)
        {
            player.setVelocityY(-250);

            player.anims.play('up', true);
        }

        else if (cursors.down.isDown || wasd.down.isDown)
        {
            player.setVelocityY(250);

            player.anims.play('down', true);
        }

        else
        {
            player.anims.play('turn');
        }
    };

function moveFurfur()
    {
        // furfur movement
        if ((furfur.x < player.x-2) && (furfur.y < player.y-2))
        {
            furfur.x += 2;
            furfur.y += 2;
            furfur.anims.play('furfur_right', true);
            furfur.flipX = false;
        }

        else if ((furfur.x < player.x-2) && (furfur.y > player.y-2))
        {
            furfur.x += 2;
            furfur.y -= 2;
            furfur.anims.play('furfur_right', true);
            furfur.flipX = false;
        }

        else if ((furfur.x > player.x-2) && (furfur.y > player.y-2))
        {
            furfur.x -= 2;
            furfur.y -= 2;
            furfur.anims.play('furfur_left', true);
            furfur.flipX = true;
        }

        else if ((furfur.x > player.x-2) && (furfur.y < player.y-2))
        {
            furfur.x -= 2;
            furfur.y += 2;
            furfur.anims.play('furfur_left', true);
            furfur.flipX = true;
        }

        else if (furfur.y >= player.y+2)
        {
            furfur.y -= 2;
            furfur.anims.play('furfur_up', true);
        }
        else if (furfur.y < player.y-2)
        {
            furfur.y += 2;
            furfur.anims.play('furfur_down', true);
        }

        else if (furfur.x >= player.x+2)
        {
            furfur.x -= 2;
            furfur.anims.play('furfur_left', true);
            furfur.flipX = true;
        }

        else if (furfur.x < player.x-2)
        {
            furfur.x += 2;
            furfur.anims.play('furfur_right', true);
            furfur.flipX = false;
        }

        hitbox.x = furfur.x;
        hitbox.y = furfur.y + 25;
    };

function setFurfurCoord()
  {
    // x coordinate
    if (playerX >= 400){
      furfur.x = playerX - 300;
    }
    else {
      furfur.x = playerX + 300;
    }

    // y coordinate
    if (playerY >= 300){
      furfur.y = playerY - 250;
    }
    else {
      furfur.y = playerY + 250;
    }
  };

function moveProtection()
  {
    protection.x = player.x;
    protection.y = player.y;
  };

function protTimer()
  {
    console.log(protTime)
    if (protTime > 0){
      protTime = (protTime - 1);
    }
    else if (protTime == 0){
      protection.setVisible(false);
      protection.disableBody(true,true);
      furfur.body.enable = true;
      isProtected = false;
      clearInterval(protTimeCounter);
      protTimeCounter = false;
      protTimerOn = false;
      protTime = 10;
    }
  }
