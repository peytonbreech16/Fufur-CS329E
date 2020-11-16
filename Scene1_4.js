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

class Scene1_4 extends Phaser.Scene
{
    constructor()
    {
        super("Scene1_4");
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
        this.load.spritesheet('blood', 'assets/blood.png', { frameWidth: 160, frameHeight: 128 });
        this.load.image('orb', 'assets/orb.png');
        this.load.image('ground','assets/ground.png');
        this.load.image('tallTree','assets/tallTree.png');
        this.load.image('wideTree','assets/wideTree.png');
        this.load.audio('BackgroundMusic',['assets/BackgroundMusic2.mp3']);
        this.load.audio('FurfurMusic',['assets/FurfurMusic.mp3']);
        this.load.audio('pickUp',['assets/PickUp_1.wav']);
        this.load.image('candle', 'assets/candleOff.png');
        this.load.image('bigStump', 'assets/bigStump.png');
        this.load.image('vPath', 'assets/vertStonePath.png');
        this.load.image('hPath', 'assets/horizStonePath.png');
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

        var tree1 = trees.create(580,350,'tallTree');
        tree1.body.setCircle(50);
        tree1.body.setOffset(10, -5);

        var tree2 = trees.create(400,440,'tallTree');
        tree2.body.setCircle(50);
        tree2.body.setOffset(0, -5);

        var tree3 = trees.create(180,350,'tallTree');
        tree3.body.setCircle(50);
        tree3.body.setOffset(-5, 0);

        for (var i=0; i < 900; i+=90)
        {
            trees.create(i,52,'tallTree');
            trees.create(i,120,'tallTree');
        };

        for (var i=10; i < 270; i+=90)
        {
            trees.create(i-90,350,'tallTree');
            trees.create(i,440,'tallTree');
            trees.create(i,530,'tallTree');
        };

        trees.create(750,210,'tallTree');

        for (var i=580; i < 1000; i+=90)
        {
            trees.create(i+90,350,'tallTree');
            trees.create(i-90,440,'tallTree');
            trees.create(i-170,530,'tallTree');
        };

        var rocks = this.physics.add.staticGroup();
        var rock1 = rocks.create(420,280,'largeRock');
        rock1.body.setCircle(20);
        //rock1.body.setOffset(-25, -15);

        this.add.image(0,230,'hPath').setScale(1.3);
        this.add.image(60,230,'hPath').setScale(1.3);
        this.add.image(120,230,'hPath').setScale(1.3);
        this.add.image(180,230,'hPath').setScale(1.3);
        this.add.image(240,230,'hPath').setScale(1.3);
        this.add.image(300,230,'hPath').setScale(1.3);
        this.add.image(300,290,'vPath').setScale(1.3);
        this.add.image(300,350,'vPath').setScale(1.3);
        this.add.image(300,410,'vPath').setScale(1.3);
        this.add.image(300,470,'vPath').setScale(1.3);
        this.add.image(300,530,'vPath').setScale(1.3);

        var log1 = trees.create(300,550,'log');

        var grass = this.add.image(235,270,'grass');
        grass.flipX = true;
        grass = this.add.image(470,320,'grass');
        grass.flipY = true;
        this.add.image(550,210,'grass');

        var blood = this.add.sprite(640,245,'blood');
        blood.setFrame(1);

        //puzzle pieces
        if (!itemCollected3)
        {
          puzzlePieces.create(600,200,'candle');
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
        this.physics.add.collider(player, rocks);

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

        leftBorder = this.add.rectangle(0,230,25,120, 0xFF0000);
        this.physics.add.existing(leftBorder);
        this.physics.add.overlap(player, leftBorder, this.moveRoomLeft, null, this);

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
        itemCollected3 = true;
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
        prevRoom = "Scene1_4";
        this.scene.start("Scene1", {x: playerX, y: 550});
    }

    moveRoomDown(player, bottomBorder)
    {
        prevRoom = "Scene1_4";
        this.scene.start("Scene1", {x: playerX, y: 50});
    }

    moveRoomLeft(player, leftBorder)
    {
        prevRoom = "Scene1_4";
        this.scene.start("Scene1_3", {x: 750, y: playerY});
    }

    moveRoomRight(player, rightBorder)
    {
        prevRoom = "Scene1_4";
        this.scene.start("Scene1", {x: 50, y: playerY});
    }
};
