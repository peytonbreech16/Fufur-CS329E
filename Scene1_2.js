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

class Scene1_2 extends Phaser.Scene
{
    constructor()
    {
        super("Scene1_2");
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
        this.load.audio('ironSFX',['assets/ironSFX.wav']);
        this.load.image('iron', 'assets/iron.png');
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
        ironSFX = this.sound.add('ironSFX');
        ironSFX.setVolume(2);

        // add trees
        trees = this.physics.add.staticGroup();
        puzzlePieces = this.physics.add.staticGroup();
        trees.create(10,52,'tallTree');
        trees.create(75,52,'tallTree');
        trees.create(520,52,'tallTree');
        trees.create(580,52,'tallTree');
        trees.create(650,52,'tallTree');
        trees.create(725,52,'tallTree');
        trees.create(780,52,'tallTree');
        trees.create(30,145,'tallTree');

        var tree1 = trees.create(150,52,'tallTree');
        tree1.body.setCircle(50);
        tree1.body.setOffset(-10, 20);

        var tree2 = trees.create(100,145,'tallTree');
        tree2.body.setCircle(50);
        tree2.body.setOffset(-20, 40);

        var tree3 = trees.create(25,480,'tallTree');
        tree3.body.setCircle(50);
        tree3.body.setOffset(-20, 10);

        var tree4 = trees.create(725,525,'tallTree');
        tree4.body.setCircle(50);
        tree4.body.setOffset(0, 20);

        var tree5 = trees.create(775,480,'tallTree');
        tree5.body.setCircle(50);
        tree5.body.setOffset(0, 30);

        for (var i=100; i < 700; i+=90)
        {
            trees.create(i,540,'tallTree');
        };

        var stump1 = trees.create(480,180,'bigStump');
        stump1.body.setCircle(30);
        stump1.body.setOffset(25, -5);

        var stump2 = trees.create(480,420,'wideTree');
        stump2.body.setCircle(60);
        stump2.body.setOffset(25, 0);

        var blood = this.add.sprite(400,140,'blood').setScale(.5);
        blood.setFrame(3);
        blood.flipY = true;

        blood = this.add.sprite(485,165,'blood').setScale(1.4);
        blood.setFrame(0);

        var dirt = this.add.image(650,180,'dirt');
        dirt.flipX = true;
        this.add.image(670,190,'dirt');
        this.add.image(120,360,'dirt').setScale(1.5);

        var grass = this.add.image(210,153,'grass');
        grass.flipY = true;
        this.add.image(660,365,'grass');
        grass = this.add.image(670,365,'grass');
        grass.flipX = true;
        grass.flipY = true;
        this.add.image(310,280,'grass');

        //puzzle pieces
        if (!itemCollected2)
        {
          puzzlePieces.create(600,200,'iron').setScale(1.5);
        }


        // The player and its settings
        player = this.physics.add.sprite(this.playerSpawnX, this.playerSpawnY, 'dude');

        //The enemy (furfur) and its settings
        furfur = this.physics.add.sprite(100, 530, 'furfur');
        furfur.setVisible(false);
        furfur.disableBody(true,true);

        // The enemy hit box
        hitbox = this.physics.add.sprite(furfur.x, furfur.y, 'hitbox');
        hitbox.setVisible(true);
        hitbox.disableBody(true,true);

        //  Player and furfur physics properties. Give the little guy a slight bounce.
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        this.physics.add.collider(player, trees);

        //Player touching puzzle pieces
        this.physics.add.overlap(player, puzzlePieces, this.pickUpPiece, null, this);

        //Text for showing how many puzzle pieces collected
        scoreText = this.add.text(20, 20, 'Pieces Collected: ' + collectedPieces + '/3', {fontFamily: 'Headache', fontSize: 22, fill: '#ff0' });

        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();
        wasd = this.input.keyboard.addKeys(
            {up:Phaser.Input.Keyboard.KeyCodes.W,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            right:Phaser.Input.Keyboard.KeyCodes.D});

        // room change objects

        topBorder = this.add.rectangle(350,0,325,25, 0xfcf488,.4);
        this.physics.add.existing(topBorder);
        this.physics.add.overlap(player, topBorder, this.moveRoomUp, null, this);

        leftBorder = this.add.rectangle(0,300,25,250, 0xfcf488,.4);
        this.physics.add.existing(leftBorder);
        this.physics.add.overlap(player, leftBorder, this.moveRoomLeft, null, this);

        rightBorder = this.add.rectangle(800, 275, 25, 300, 0xfcf488,.4);
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

          orbs = this.physics.add.staticGroup();

          //Player touching orbs
          this.physics.add.overlap(player, orbs, this.pickUpOrb, null, this);

          //Text for showing how many orbs player can use
          orbText = this.add.text(20, 40, 'Orbs: ' + numOrbs, {fontFamily: 'Headache', fontSize: 22, fill: '#ff0' });

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
          orbText.setText('Orbs: ' + numOrbs);
          protTimeCounter = setInterval(protTimer, 1000); // countdown
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
        ironSFX.play();
        collectedPieces++;
        itemCollected2 = true;
        if (collectedPieces >= 3)
        {
            //backgroundMusic.stop();
            //furfurMusic.stop();
            furfurSpawned = false;
            //musicPlaying = false;
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
        prevRoom = "Scene1_2";
        this.scene.start("Scene2_2", {x: playerX, y: 550});
    }

    moveRoomDown(player, bottomBorder)
    {
        prevRoom = "Scene1_2";
        this.scene.start("Scene1", {x: playerX, y: 50});
    }

    moveRoomLeft(player, leftBorder)
    {
        prevRoom = "Scene1_2";
        this.scene.start("Scene1", {x: 750, y: playerY});
    }

    moveRoomRight(player, rightBorder)
    {
        prevRoom = "Scene1_2";
        this.scene.start("Scene1_3", {x: 50, y: playerY});
    }
};
