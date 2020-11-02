var cursors;
var wasd;
var gameOver = false;
var trees;
var puzzlePieces;
var scoreText;
var topBorder;
var bottomBorder;
var leftBorder;
var rightBorder;

class Scene3_3 extends Phaser.Scene
{
    constructor()
    {
        super("Scene3_3");
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
        this.load.spritesheet('dude', 'assets/player.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('furfur', 'assets/demon.png', {frameWidth: 200, frameHeight: 155});
        this.load.spritesheet('protect', 'assets/protection.png', { frameWidth: 128, frameHeight: 128 });
        this.load.image('orb', 'assets/orb.png');
        this.load.image('ground','assets/ground.png');
        this.load.image('tallTree','assets/tallTree.png');
        this.load.image('wideTree','assets/wideTree.png');
        this.load.audio('BackgroundMusic',['assets/BackgroundMusic2.mp3']);
        this.load.audio('FurfurMusic',['assets/FurfurMusic.mp3']);
        this.load.audio('pickUp',['assets/PickUp_1.wav']);
        this.load.image('salt', 'assets/salt.png');
        this.load.image('dirt', 'assets/dirtPatch.png');
        this.load.image('grass', 'assets/grassPatch.png');
    }

    create ()
    {
        // add ground
        var background = this.add.image(400,350,'ground');
        background.displayWidth = game.config.width * 1;
        background.scaleY = background.scaleX;

        //sound effects
        pickUpSFX = this.sound.add('pickUp');
        pickUpSFX.setVolume(.50);

        // add trees
        trees = this.physics.add.staticGroup();
        puzzlePieces = this.physics.add.staticGroup();

        for (var i=0; i <= 850; i+=90)
        {
            trees.create(i,52,'tallTree');
        };

        for (var i=120; i <= 700; i+=90)
        {
            trees.create(0,i,'tallTree');
            trees.create(90,i,'tallTree');
            trees.create(180,i,'tallTree');

        };

        var tree1 = trees.create(780,120,'tallTree');
        tree1.body.setCircle(50);
        tree1.body.setOffset(10, 0);

        var tree2 = trees.create(550,450,'tallTree');
        tree2.body.setCircle(50);
        tree2.body.setOffset(10, -5);

        for (var i=550; i < 900; i+=90)
        {
            trees.create(i+90,450,'tallTree');
            trees.create(i,530,'tallTree');
        };

        this.add.image(350,240,'dirt').setScale(1.5);
        var dirt = this.add.image(410,265,'dirt').setScale(1.5);
        dirt.flipX = true;
        dirt.flipY = true;
        dirt = this.add.image(720,330,'dirt').setScale(1.2);
        dirt.flipX = true;
        dirt = this.add.image(290,496,'dirt').setScale(1.8);
        dirt.flipY = true;

        var grass = this.add.image(590,155,'grass');
        grass.flipX = true;
        grass = this.add.image(500,330,'grass');
        grass.flipY = true;
        this.add.image(320,440,'grass');
        grass = this.add.image(480,525,'grass');
        grass.flipX = true;
        grass.flipY = true;
        this.add.image(250,210,'grass');

        //puzzle pieces

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
        scoreText = this.add.text(16, 16, 'Pieces Collected: ' + collectedPieces + '/3', { fontSize: '32px', fill: '#ff0' });

        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();
        wasd = this.input.keyboard.addKeys(
            {up:Phaser.Input.Keyboard.KeyCodes.W,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            right:Phaser.Input.Keyboard.KeyCodes.D});

        // room change objects
        bottomBorder = this.add.rectangle(380,600,300,25, 0xFF0000);
        this.physics.add.existing(bottomBorder);
        this.physics.add.overlap(player, bottomBorder, this.moveRoomDown, null, this);

        rightBorder = this.add.rectangle(800, 300, 25, 200, 0xFF0000);
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

          // orbs that grant furfur immunity
          orbs = this.physics.add.staticGroup();

          //Player touching orbs
          this.physics.add.overlap(player, orbs, this.pickUpOrb, null, this);

          //Text for showing how many orbs player can use
          orbText = this.add.text(16, 40, 'Orbs: ' + numOrbs, { fontSize: '32px', fill: '#ff0' });

          // protection
          protection = this.physics.add.sprite(playerX, playerY, 'protect');
          protection.setVisible(false);
          protection.disableBody(true,true);

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

    pickUpPiece(player, puzzlePieces)
    {
        puzzlePieces.destroy();
        pickUpSFX.play();
        collectedPieces++;
        if (collectedPieces >= 3)
        {
            backgroundMusic.stop();
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
      orbText.setText('Orbs: ' + numOrbs);
    }

    moveRoomUp(player, topBorder)
    {
        prevRoom = "Scene3_3";
        this.scene.start("Scene4_3", {x: playerX, y: 550});
    }

    moveRoomDown(player, bottomBorder)
    {
        prevRoom = "Scene3_3";
        this.scene.start("Scene2_3", {x: playerX, y: 50});
    }

    moveRoomLeft(player, leftBorder)
    {
        prevRoom = "Scene3_3";
        this.scene.start("Scene3_2", {x: 750, y: playerY});
    }

    moveRoomRight(player, rightBorder)
    {
        prevRoom = "Scene3_3";
        this.scene.start("Scene3_4", {x: 50, y: playerY});
    }
};
