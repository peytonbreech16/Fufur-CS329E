var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    transparent: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [Scene1, Scene1_2, Scene2_1, Scene2_2, Scene3_1, Scene3_2, Replay],


};

var game = new Phaser.Game(config);
