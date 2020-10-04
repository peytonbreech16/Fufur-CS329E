var player;
var furfur;
var cursors;
var wasd;
var gameOver = false;
var trees;
var puzzlePieces;
var collectedPieces = 0;
var scoreText;

class Scene1 extends Phaser.Scene
{
    constructor()
    {
        super("Scene1");
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
        trees.create(138,52,'tallTree');
        trees.create(243,52,'tallTree');
        trees.create(370,52,'tallTree');
        trees.create(523,52,'tallTree');
        trees.create(600,52,'tallTree');
        trees.create(689,52,'tallTree');
        trees.create(780,52,'tallTree');
        trees.create(400,300,'wideTree');
        trees.create(78,250,'tallTree');
        trees.create(175,450,'tallTree');
        trees.create(740,350,'tallTree');

        //puzzle pieces
        puzzlePieces.create(600,400,'puzzle1');
        puzzlePieces.create(600,300,'puzzle1');
        puzzlePieces.create(600,200,'puzzle1');

        // The player and its settings
        player = this.physics.add.sprite(600, 550, 'dude');

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
    }

    update()
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
            player.setFriction(0, 1);
            player.setVelocityY(-250);
        }

        else if (cursors.down.isDown || wasd.down.isDown)
        {
            player.setVelocityY(250);
        }
        else
        {
            player.anims.play('turn');
        }

        
        // furfur movement
        if (furfur.x > player.x+5)
        {
            furfur.x -= 2.3;
            furfur.anims.play('furfur_left');
            furfur.flipX = false;
        }

        else if (furfur.x < player.x-5)
        {
            furfur.x += 2.3;
            furfur.anims.play('furfur_right');
            furfur.flipX = true;
        }

        if (furfur.y > player.y+5)
        {
            furfur.y -= 2.3;
            furfur.anims.play('furfur_up');
        }
        else if (furfur.y < player.y-5)
        {
            furfur.y += 2.3;
            furfur.anims.play('furfur_down');
        }

    }

    startOver(player, furfur)
    {
        //furfur.disableBody(true,true);
        this.scene.restart();
        this.backgroundMusic.stop();
        collectedPieces = 0;
    }

    pickUpPiece(player, puzzlePieces)
    {
        puzzlePieces.destroy();
        collectedPieces++;
        scoreText.setText('Pieces Collected: ' + collectedPieces);
    }
};
