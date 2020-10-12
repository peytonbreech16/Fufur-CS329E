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

class Scene3_1 extends Phaser.Scene
{
    constructor()
    {
        super("Scene3_1");
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
        this.load.image('bigStump', 'assets/bigStump.png');
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

        for (var i=0; i <= 850; i+=90) 
        {
            trees.create(i,52,'tallTree');
        };

        var tree1 = trees.create(220,290,'tallTree');
        tree1.body.setCircle(50);
        tree1.body.setOffset(10, 0);

        var tree2 = trees.create(190,355,'tallTree');
        tree2.body.setCircle(50);
        tree2.body.setOffset(10, 30);

        for (var i=850; i >= 290; i-=90) 
        {
            trees.create(i,295,'tallTree');
            trees.create(i-30,345,'tallTree');
        };

        trees.create(30,145,'tallTree');
        trees.create(30,250,'tallTree');
        trees.create(30,365,'tallTree');
        trees.create(30,480,'tallTree');
        trees.create(775,480,'tallTree');
        trees.create(725,525,'tallTree');
        trees.create(10,560,'tallTree');
        trees.create(100,560,'tallTree');
        trees.create(190,560,'tallTree');
        trees.create(280,560,'tallTree');
        trees.create(523,560,'tallTree');
        trees.create(600,560,'tallTree');
        trees.create(689,560,'tallTree');
        trees.create(780,560,'tallTree');

        

        //puzzle pieces
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
        scoreText = this.add.text(16, 16, 'Pieces Collected: ' + collectedPieces, { fontSize: '32px', fill: '#ff0' });

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

        bottomBorder = this.add.rectangle(400,600,200,25, 0xFF0000);
        this.physics.add.existing(bottomBorder);
        this.physics.add.overlap(player, bottomBorder, this.moveRoomDown, null, this);

        // leftBorder = this.add.rectangle(400,0,200,25, 0xFF0000);
        // this.physics.add.existing(leftBorder);
        // this.physics.add.overlap(player, leftBorder, this.moveRoomLeft, null, this);

        rightBorder = this.add.rectangle(800, 200, 25, 150, 0xFF0000);
        this.physics.add.existing(rightBorder);
        this.physics.add.overlap(player, rightBorder, this.moveRoomRight, null, this);

        // time is on and furfur has spawned
        if (furfurSpawned == true && roomsTraversed < 3){
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
                this.physics.add.collider(player, furfur);
                this.physics.add.overlap(player, furfur, this.startOver, null, this);
                furfur.setCollideWorldBounds(true);
              },
            });
            roomsTraversed = roomsTraversed + 1;
          }
          else if (furfurSpawned == true && roomsTraversed == 4){
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

        //furfur.disableBody();
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
        prevRoom = "Scene3_1";
        this.scene.start("Scene1", {x: playerX, y: 550});
    }

    moveRoomDown(player, bottomBorder)
    {
        prevRoom = "Scene3_1";
        this.scene.start("Scene2_1", {x: playerX, y: 50});
    }

    moveRoomLeft(player, leftBorder)
    {
        prevRoom = "Scene3_1";
        this.scene.start("Scene1", {x: 750, y: playerY});
    }

    moveRoomRight(player, rightBorder)
    {
        prevRoom = "Scene3_1";
        this.scene.start("Scene3_2", {x: 50, y: playerY});
    }
};
