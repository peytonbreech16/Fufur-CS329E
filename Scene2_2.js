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

class Scene2_2 extends Phaser.Scene
{
    constructor()
    {
        super("Scene2_2");
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
        this.load.spritesheet('furfur', 'assets/furfur.png', { frameWidth: 90, frameHeight: 117 });
        this.load.image('ground','assets/ground.png');
        this.load.image('tallTree','assets/tallTree.png');
        this.load.image('wideTree','assets/wideTree.png');
        this.load.audio('BackgroundMusic',['assets/BackgroundMusic2.mp3']);
        this.load.image('salt', 'assets/salt.png');
    }

    create ()
    {
        // add ground
        var background = this.add.image(400,350,'ground');
        background.displayWidth = game.config.width * 1;
        background.scaleY = background.scaleX;

        // add trees
        trees = this.physics.add.staticGroup();
        puzzlePieces = this.physics.add.staticGroup();
        trees.create(10,52,'tallTree');
        trees.create(100,52,'tallTree');
        trees.create(190,52,'tallTree');
        trees.create(280,52,'tallTree');
        trees.create(600,52,'tallTree');
        trees.create(689,52,'tallTree');
        trees.create(780,52,'tallTree');
        trees.create(25,480,'tallTree');
        trees.create(75,525,'tallTree');
        trees.create(610,450,'tallTree');
        trees.create(690,450,'tallTree');
        trees.create(775,450,'tallTree');
        trees.create(150,525,'tallTree');
        trees.create(725,525,'tallTree');
        trees.create(520,525,'tallTree');
        trees.create(580,525,'tallTree');
        trees.create(650,525,'tallTree');

        var tree1 = trees.create(400,270,'wideTree');
        tree1.body.setCircle(60);

        var tree2 = trees.create(540,450,'tallTree');
        tree2.body.setCircle(55);
        tree2.body.setOffset(0,-3);


        //puzzle pieces
        puzzlePieces.create(600,400,'salt');
        puzzlePieces.create(600,300,'salt');
        puzzlePieces.create(600,200,'salt');

        // The player and its settings
        player = this.physics.add.sprite(this.playerSpawnX, this.playerSpawnY, 'dude');

        //The enemy (furfur) and its settings
        furfur = this.physics.add.sprite(100, 530, 'furfur');
        furfur.setVisible(false);
        furfur.disableBody(true,true);

        //Add collider for player and furfur and when they touch each other
        // this.physics.add.collider(player, furfur);
        // this.physics.add.overlap(player, furfur, this.startOver, null, this);

        //  Player and furfur physics properties. Give the little guy a slight bounce.
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        this.physics.add.collider(player, trees);

        //Player touching puzzle pieces
        this.physics.add.overlap(player, puzzlePieces, this.pickUpPiece, null, this);

        //Text for showing how many puzzle pieces collected
        scoreText = this.add.text(16, 16, 'Pieces Collected: 0', { fontSize: '32px', fill: '#ff0' });

        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();
        wasd = this.input.keyboard.addKeys(
            {up:Phaser.Input.Keyboard.KeyCodes.W,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            right:Phaser.Input.Keyboard.KeyCodes.D});

        // room change objects

        // topBorder = this.add.rectangle(400,0,200,25, 0xFF0000);
        // this.physics.add.existing(topBorder);
        // this.physics.add.overlap(player, topBorder, this.moveRoomUp, null, this);

        bottomBorder = this.add.rectangle(350,600,325,25, 0xFF0000);
        this.physics.add.existing(bottomBorder);
        this.physics.add.overlap(player, bottomBorder, this.moveRoomDown, null, this);

        leftBorder = this.add.rectangle(0,275,25,300, 0xFF0000);
        this.physics.add.existing(leftBorder);
        this.physics.add.overlap(player, leftBorder, this.moveRoomLeft, null, this);

        // rightBorder = this.add.rectangle(800, 275, 25, 300, 0xFF0000);
        // this.physics.add.existing(rightBorder);
        // this.physics.add.overlap(player, rightBorder, this.moveRoomRight, null, this);

        // time is on and furfur has spawned
        if (furfurSpawned == true && roomsTraversed < 3){
          this.time.addEvent({
            delay: 750,
            // spawn furfur
            callback: () =>{
              if (prevRoom == 'Scene2_1'){
                var x = 50;
                var y = 300;
                furfur = this.physics.add.sprite(x, y, 'furfur');
              }
              else if (prevRoom == 'Scene1_2'){
                var x = 400;
                var y = 550;
                furfur = this.physics.add.sprite(x, y, 'furfur');
              };
              furfur.setActive(true).setVisible(true);
              furfur.body.enable = true;
              furfurSpawned = true;
              this.physics.add.collider(player, furfur);
              this.physics.add.overlap(player, furfur, this.startOver, null, this);
              furfur.setCollideWorldBounds(true);
            },
          });
          roomsTraversed = roomsTraversed + 1;
        }
        else if (furfurSpawned == true && roomsTraversed == 3){
          roomsTraversed = 0;
          furfurSpawned = false;
        }

        // furfur has not yet spawned
        if (furfurSpawned == false){
          var furfurCooldown = Phaser.Math.Between(2000,5000);
          this.time.addEvent({
            delay: furfurCooldown,
            // spawn furfur
            callback: () =>{
              furfur = this.physics.add.sprite(0, 0, 'furfur');
              furfur.setActive(true).setVisible(true);
              furfur.body.enable = true;
              furfurSpawned = true;
              var collider = this.physics.add.collider(player, furfur);
              var overlap = this.physics.add.overlap(player, furfur, this.startOver, null, this);
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

    startOver(player, furfur)
    {
        this.scene.start("Replay");
        backgroundMusic.stop();
        collectedPieces = 0;
    }

    pickUpPiece(player, puzzlePieces)
    {
        puzzlePieces.destroy();
        collectedPieces++;
        scoreText.setText('Pieces Collected: ' + collectedPieces);
    }

    moveRoomUp(player, topBorder)
    {
        prevRoom = "Scene2_2";
        this.scene.start("Scene1", {x: playerX, y: 550});
    }

    moveRoomDown(player, bottomBorder)
    {
        prevRoom = "Scene2_2";
        this.scene.start("Scene1_2", {x: playerX, y: 50});
    }

    moveRoomLeft(player, leftBorder)
    {
        prevRoom = "Scene2_2";
        this.scene.start("Scene2_1", {x: 750, y: playerY});
    }

    moveRoomRight(player, rightBorder)
    {
        prevRoom = "Scene2_2";
        this.scene.start("Scene1", {x: 50, y: playerY});
    }
};
