var player;
var furfur;
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
        this.load.spritesheet('furfur', 'assets/furfur.png', { frameWidth: 90, frameHeight: 117 });
        this.load.image('ground','assets/ground.png');
        this.load.image('tallTree','assets/tallTree.png');
        this.load.image('wideTree','assets/wideTree.png');
        this.load.audio('BackgroundMusic',['assets/BackgroundMusic2.mp3']);
        this.load.audio('FurfurMusic',['assets/FurfurMusic.mp3']);
        this.load.audio('pickUp',['assets/PickUp_1.wav']);
        this.load.image('salt', 'assets/salt.png');
        this.load.image('medRock', 'assets/medRock.png');
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
        trees.create(280,52,'tallTree');
        trees.create(523,52,'tallTree');
        trees.create(600,52,'tallTree');
        trees.create(689,52,'tallTree');
        trees.create(780,52,'tallTree');
        trees.create(770,145,'tallTree');
        trees.create(30,145,'tallTree');
        trees.create(25,250,'tallTree');
        trees.create(35,365,'tallTree');
        trees.create(25,480,'tallTree');
        trees.create(75,525,'tallTree');
        trees.create(775,480,'tallTree');
        trees.create(725,525,'tallTree');

        // add rocks
        var rocks = this.physics.add.staticGroup();
        rocks.create(300,200,'medRock');
        rocks.create(300,400,'medRock');
        rocks.create(500,200,'medRock');
        rocks.create(500,400,'medRock');
        rocks.scaleXY(1);

        //puzzle pieces
        puzzlePieces.create(600,400,'salt');

        // The player and its settings
        player = this.physics.add.sprite(this.playerSpawnX, this.playerSpawnY, 'dude');

        //The enemy (furfur) and its settings
        furfur = this.physics.add.sprite(100, 530, 'furfur');
        furfur.setVisible(false);
        furfur.disableBody(true,true);

        //  Player and furfur physics properties. Give the little guy a slight bounce.
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        this.physics.add.collider(player, trees);

        //Player touching puzzle pieces
        this.physics.add.overlap(player, puzzlePieces, this.pickUpPiece, null, this);

        //Text for showing how many puzzle pieces collected
        scoreText = this.add.text(16, 16, 'Pieces Collected: ' + collectedPieces, { fontSize: '32px', fill: '#ff0' });

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
            frameRate: 20,
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
            frames: [{key: 'furfur', frame:0}],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{key: 'furfur', frame:1}],
            frameRate: 20
        });

        this.anims.create({
            key: 'furfur_right',
            frames: [{key: 'furfur', frame:0}],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'furfur_up',
            frames: [{key: 'furfur', frame:2}],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'furfur_down',
            frames: [{key: 'furfur', frame:1}],
            frameRate: 10,
            repeat: -1
        });

        // room change objects

        topBorder = this.add.rectangle(400,0,200,25, 0xFF0000);
        this.physics.add.existing(topBorder);
        this.physics.add.overlap(player, topBorder, this.moveRoomUp, null, this);

        rightBorder = this.add.rectangle(800, 300, 25, 250, 0xFF0000);
        this.physics.add.existing(rightBorder);
        this.physics.add.overlap(player, rightBorder, this.moveRoomRight, null, this);

        // furfur is chasing player
        if (furfurSpawned && roomsTraversed < 3){
          this.time.addEvent({
            delay: 750,

            // spawn furfur
            callback: () =>{
              var x = this.playerSpawnX;
              var y = this.playerSpawnY;
              furfur = this.physics.add.sprite(x, y, 'furfur');
              furfur.setActive(true).setVisible(true);
              furfur.body.enable = true;
              furfurSpawned = true;
              this.physics.add.overlap(player, furfur, this.startOver, null, this);
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

        if (!furfurSpawned){
          var randomSpawn = Phaser.Math.Between(0,1); // should furfur spawn?
          if (randomSpawn <= 0.5){
            randomSpawn = false;
          }
          else {
            randomSpawn = true;
          }

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
              furfur.setActive(true).setVisible(true);
              furfur.body.enable = true;

              //music playing for furfur spawn
              backgroundMusic.stop();
              furfurMusic.play();

              this.physics.add.overlap(player, furfur, this.startOver, null, this);
              setFurfurCoord();
              furfur.setCollideWorldBounds(true);
              furfurSpawned = true;
            },
          });
        }
    }

    update()
    {
        playerX = player.x;
        playerY = player.y;

        movePlayer();

        moveFurfur();
    }

    //function for when the game needs to start over
    startOver(player, furfur)
    {
        this.scene.switch('Replay');
        backgroundMusic.stop();
        furfurMusic.stop();
        collectedPieces = 0;
        furfurSpawned = false;
        musicPlaying = false;
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
            this.scene.switch('YouWin');
            backgroundMusic.stop();
            furfurMusic.stop();
            collectedPieces = 0;
            furfurSpawned = false;
            musicPlaying = false;
        }
        scoreText.setText('Pieces Collected: ' + collectedPieces);
    }


    moveRoomUp(player, topBorder)
    {
        prevRoom = "Scene1";
        this.scene.start("Scene2_1", {x: playerX, y: 550});
    }

    moveRoomDown(player, bottomBorder)
    {
        prevRoom = "Scene1";
        this.scene.start("Scene1", {x: playerX, y: 50});
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
        if (furfur.x > player.x+2)
        {
            furfur.x -= 2;
            furfur.anims.play('furfur_left');
            furfur.flipX = false;
        }

        else if (furfur.x < player.x-2)
        {
            furfur.x += 2;
            furfur.anims.play('furfur_right');
            furfur.flipX = true;
        }

        if (furfur.y > player.y+2)
        {
            furfur.y -= 2;
            furfur.anims.play('furfur_up');
        }
        else if (furfur.y < player.y-2)
        {
            furfur.y += 2;
            furfur.anims.play('furfur_down');
        }
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
