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
    scene: [StartScreen,
        Scene1, Scene1_2, Scene1_3, Scene1_4,
        Scene2_1, Scene2_2, Scene2_3, Scene2_4,
        Scene3_1, Scene3_2, Scene3_3, Scene3_4, Scene3_5,
        Scene0_1, Scene0_2, Scene0_3,
        Replay, YouWin, Instructions, Credits],


};

var game = new Phaser.Game(config);
