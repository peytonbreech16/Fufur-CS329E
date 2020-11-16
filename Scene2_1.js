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

class Scene2_1 extends Phaser.Scene
{
    constructor()
    {
        super("Scene2_1");
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
        this.load.image('bigStump', 'assets/bigStump.png');
        this.load.image('dirt', 'assets/dirtPatch.png');
        this.load.image('grass', 'assets/grassPatch.png');
        this.load.image('hitbox', 'assets/hitbox.png');
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

        var tree5 = trees.create(775,480,'tallTree');
        tree5.body.setCircle(50);
        tree5.body.setOffset(0, 20);

        var tree6 = trees.create(725,525,'tallTree');
        tree6.body.setCircle(50);
        tree6.body.setOffset(0, 20);

        trees.create(10,52,'tallTree');
        trees.create(100,52,'tallTree');
        trees.create(190,52,'tallTree');
        trees.create(600,52,'tallTree');
        trees.create(689,52,'tallTree');
        trees.create(780,52,'tallTree');
        trees.create(30,145,'tallTree');
        trees.create(25,250,'tallTree');
        trees.create(35,365,'tallTree');
        trees.create(25,480,'tallTree');
        trees.create(75,525,'tallTree');
        trees.create(10,560,'tallTree');
        trees.create(100,560,'tallTree');
        trees.create(190,560,'tallTree');
        trees.create(600,560,'tallTree');
        trees.create(689,560,'tallTree');
        trees.create(780,560,'tallTree');

        var tree1 = trees.create(280,52,'tallTree');
        tree1.body.setCircle(50);
        tree1.body.setOffset(-10, 40);

        var tree2 = trees.create(523,52,'tallTree');
        tree2.body.setCircle(50);
        tree2.body.setOffset(0, 40);

        var tree3 = trees.create(280,560,'tallTree');
        tree3.body.setCircle(50);
        tree3.body.setOffset(-10, -5);

        var tree4 = trees.create(523,560,'tallTree');
        tree4.body.setCircle(50);
        tree4.body.setOffset(0, -5);

        var stump1 = trees.create(140,350,'bigStump');
        stump1.body.setCircle(30);
        stump1.body.setOffset(25, -5);

        var stump2 = trees.create(600,250,'bigStump');
        stump2.setScale(1.25);
        stump2.body.setCircle(50);
        stump2.body.setOffset(10,-20);

        this.add.image(345,210,'dirt').setScale(1.5);
        var dirt = this.add.image(345,230,'dirt').setScale(1.8);
        dirt.flipY = true;
        dirt.flipX = true
        this.add.image(415,550,'dirt').setScale(1.8);

        this.add.image(690,395,'grass');
        var grass = this.add.image(480,310,'grass');
        grass.flipY = true;
        grass = this.add.image(170,430,'grass');
        grass.flipX = true;
        this.add.image(150,200,'grass');
        grass = this.add.image(170,195,'grass');
        grass.flipX = true;
        grass.flipY = true;
        this.add.image(155,690,'grass');
        this.add.image(680,180,'grass');

        //puzzle pieces

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
        scoreText = this.add.text(16, 16, 'Pieces Collected: ' + collectedPieces + '/3', { fontSize: '32px', fill: '#ff0' });

        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();
        wasd = this.input.keyboard.addKeys(
            {up:Phaser.Input.Keyboard.KeyCodes.W,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            right:Phaser.Input.Keyboard.KeyCodes.D});

        // room change objects

        topBorder = this.add.rectangle(400,0,200,25, 0xFF0000);
        this.physics.add.existing(topBorder);
        this.physics.add.overlap(player, topBorder, this.moveRoomUp, null, this);

        bottomBorder = this.add.rectangle(400,600,200,25, 0xFF0000);
        this.physics.add.existing(bottomBorder);
        this.physics.add.overlap(player, bottomBorder, this.moveRoomDown, null, this);

        rightBorder = this.add.rectangle(800, 275, 25, 300, 0xFF0000);
        this.physics.add.existing(rightBorder);
        this.physics.add.overlap(player, rightBorder, this.moveRoomRight, null, this);

        // time is on and furfur has spawned
        if (furfurSpawned == true && roomsTraversed < 3){
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
              hitbox = this.physics.add.sprite(0, 0, 'hitbox');
              hitbox.setActive(true).setVisible(false);
              hitbox.body.enable = true;
              //music playing for furfur spawn
              backgroundMusic.stop();
              furfurMusic.play();
              furfurSpawned = true;
              this.physics.add.overlap(player, hitbox, this.startOver, null, this);
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
        prevRoom = "Scene2_1";
        this.scene.start("Scene3_1", {x: playerX, y: 550});
    }

    moveRoomDown(player, bottomBorder)
    {
        prevRoom = "Scene2_1";
        this.scene.start("Scene1", {x: playerX, y: 50});
    }

    moveRoomLeft(player, leftBorder)
    {
        prevRoom = "Scene2_1";
        this.scene.start("Scene1", {x: 750, y: playerY});
    }

    moveRoomRight(player, rightBorder)
    {
        prevRoom = "Scene2_1";
        this.scene.start("Scene2_2", {x: 50, y: playerY});
    }

};
