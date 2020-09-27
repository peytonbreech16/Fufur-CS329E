var player;
var cursors;
var wasd;
var gameOver = false;

class Scene1 extends Phaser.Scene {
    constructor() {
        super("Scene1");
    }


    preload() {
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create () {
        // The player and its settings
        player = this.physics.add.sprite(100, 450, 'dude');

        //  Player physics properties. Give the little guy a slight bounce.
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

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

        
    }

    update() {

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
        else
        {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if (cursors.up.isDown || wasd.up.isDown)
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
            player.setVelocityY(0);
        }
        
    };
};

