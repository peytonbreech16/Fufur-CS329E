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
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('furfur', 'assets/furfur.png', { frameWidth: 90, frameHeight: 117 });
        this.load.image('ground','assets/ground.png');
        this.load.image('tallTree','assets/tallTree.png');
        this.load.image('wideTree','assets/wideTree.png');
        this.load.audio('BackgroundMusic',['assets/BackgroundMusic2.mp3']);
        this.load.image('puzzle1', 'assets/tempPickUp.png');
    }

    create ()
    {
        // add ground
        var background = this.add.image(400,350,'ground');
        background.displayWidth = game.config.width * 1;
        background.scaleY = background.scaleX;
        this.backgroundMusic = this.sound.add('BackgroundMusic');
        this.backgroundMusic.play();

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
        trees.create(30,145,'tallTree');
        trees.create(25,250,'tallTree');
        trees.create(35,365,'tallTree');
        trees.create(400,300,'wideTree');
        trees.create(25,480,'tallTree');
        trees.create(75,525,'tallTree');
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
        puzzlePieces.create(600,400,'puzzle1');
        puzzlePieces.create(600,300,'puzzle1');
        puzzlePieces.create(600,200,'puzzle1');

        // The player and its settings
        player = this.physics.add.sprite(this.playerSpawnX, this.playerSpawnY, 'dude');

        //The enemy (furfur) and its settings
        furfur = this.physics.add.sprite(100, 530, 'furfur');

        //Add collider for player and furfur and when they touch each other
        this.physics.add.collider(player, furfur);
        this.physics.add.overlap(player, furfur, this.startOver, null, this);

        //  Player and furfur physics properties. Give the little guy a slight bounce. 
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        furfur.setCollideWorldBounds(true);
        this.physics.add.collider(player, trees);

        //Player touching puzzle pieces
        this.physics.add.overlap(player, puzzlePieces, this.pickUpPiece, null, this);

        //Text for showing how many puzzle pieces collected
        scoreText = this.add.text(16, 16, 'Pieces Collected: 0', { fontSize: '32px', fill: '#ff0' });

        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
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

        // topBorder = this.add.rectangle(400,0,200,25, 0xFF0000);
        // this.physics.add.existing(topBorder);
        // this.physics.add.overlap(player, topBorder, this.moveRoomUp, null, this);

        bottomBorder = this.add.rectangle(400,600,200,25, 0xFF0000);
        this.physics.add.existing(bottomBorder);
        this.physics.add.overlap(player, bottomBorder, this.moveRoomDown, null, this);

        // leftBorder = this.add.rectangle(400,0,200,25, 0xFF0000);
        // this.physics.add.existing(leftBorder);
        // this.physics.add.overlap(player, leftBorder, this.moveRoomLeft, null, this);

        rightBorder = this.add.rectangle(800, 275, 25, 300, 0xFF0000);
        this.physics.add.existing(rightBorder);
        this.physics.add.overlap(player, rightBorder, this.moveRoomRight, null, this);

    }

    update()
    {
        playerX = player.x;
        playerY = player.y;

        movePlayer();
        
        //moveFurfur();
    }

    startOver(player, furfur)
    {
        //furfur.disableBody(true,true);
        this.scene.start("Scene1");
        this.backgroundMusic.stop();
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
        this.scene.start("Scene1", {x: playerX, y: 550});
    }

    moveRoomDown(player, bottomBorder)
    {
        this.scene.start("Scene1", {x: playerX, y: 50});
    }

    moveRoomLeft(player, leftBorder)
    {
        this.scene.start("Scene1", {x: 750, y: playerY});
    }

    moveRoomRight(player, rightBorder)
    {
        this.scene.start("Scene2_2", {x: 50, y: playerY});
    }
};
