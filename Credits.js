var backButton2;
var playButton3;

class Credits extends Phaser.Scene{
  constructor(){
    super({key:'Credits'});
  }

  preload(){
    this.load.image('back1', 'assets/background1.png');
  }

  create(){

    // background and buttons
    var back1 = this.add.image(400,300,'back1');
    back1.displayWidth = game.config.width * 1;
    back1.scaleY = back1.scaleX;

    playButton3 = this.add.text(320,515,'Start',{fontFamily:'Curse',fontSize:45,fill:"#856f6f"});
    playButton3.setInteractive({useHandCursor: true});
    playButton3.on('pointerdown', function() {
      this.scene.switch('Scene1');
    }, this);

    backButton2 = this.add.text(425,515,'Back',{fontFamily:'Curse',fontSize:45,fill:"#856f6f"});
    backButton2.setInteractive({useHandCursor: true});
    backButton2.on('pointerdown', function() {
      this.scene.switch('StartScreen');
    }, this);

    // text
    this.add.text(340,5,"Credits",{fontFamily:'Curse',fontSize:60,fill:"#856f6f"});

    this.add.text(115+380,110,'Producer:',{fontFamily:'Headache',fontSize:28,fill:"#856f6f"});
    this.add.text(115+380,140,"Paul Toprac",{fontFamily:'Headache',fontSize:22,fill:"#856f6f"});

    this.add.text(30+380,200,'Assistant Producers:',{fontFamily:'Headache',fontSize:28,fill:"#856f6f"});
    this.add.text(115+380,230,"Gahwon Lee",{fontFamily:'Headache',fontSize:22,fill:"#856f6f"});
    this.add.text(100+380,255,"Biswajit Saha",{fontFamily:'Headache',fontSize:22,fill:"#856f6f"});

    this.add.text(495-390,140,'Developers:',{fontFamily:'Headache',fontSize:28,fill:"#856f6f"});
    this.add.text(485-390,170,"Peyton Breech",{fontFamily:'Headache',fontSize:22,fill:"#856f6f"});
    this.add.text(505-390,195,"Danny Lee",{fontFamily:'Headache',fontSize:22,fill:"#856f6f"});
    this.add.text(490-390,220,"Marissa Vera",{fontFamily:'Headache',fontSize:22,fill:"#856f6f"});

    this.add.text(150,290+40,'Art:',{fontFamily:'Headache',fontSize:24,fill:"#856f6f"});
    this.add.text(37,315+40,"Beast Pixels: beast-pixels.itch.io",{fontFamily:'Headache',fontSize:15,fill:"#856f6f"});
    this.add.text(40,335+40,"Gamekrazzy: gamekrazzy.itch.io",{fontFamily:'Headache',fontSize:15,fill:"#856f6f"});
    this.add.text(95,355+40,"Nyknck: kvsr.itch.io",{fontFamily:'Headache',fontSize:15,fill:"#856f6f"});
    this.add.text(50,375+40,"Penusbmic: penusbmic.itch.io",{fontFamily:'Headache',fontSize:15,fill:"#856f6f"});
    this.add.text(37,395+40,"Raeg Studios: raegstudios.itch.io",{fontFamily:'Headache',fontSize:15,fill:"#856f6f"});
    this.add.text(88,415+40,"Sven: sventhole.itch.io",{fontFamily:'Headache',fontSize:15,fill:"#856f6f"});
    this.add.text(65,435+40,"Szadi Art: szadiart.itch.io",{fontFamily:'Headache',fontSize:15,fill:"#856f6f"});

    this.add.text(525,290+60,'Music:',{fontFamily:'Headache',fontSize:24,fill:"#856f6f"});
    this.add.text(513,315+60,"Mary Riddle:",{fontFamily:'Headache',fontSize:15,fill:"#856f6f"});
    this.add.text(420,335+60,"epidemicsound.com/artists/mary-riddle",{fontFamily:'Headache',fontSize:15,fill:"#856f6f"});

    this.add.text(535,365+60,"SFX:",{fontFamily:'Headache',fontSize:24,fill:"#856f6f"});
    this.add.text(505,390+60,"freesound.org",{fontFamily:'Headache',fontSize:15,fill:"#856f6f"});

  }

  update(){
    // button interactives
    playButton3.on('pointerover', function() {
      playButton3.setTintFill(0x450000);
    }, this);

    playButton3.on('pointerout', function() {
      playButton3.clearTint();
    }, this);

    backButton2.on('pointerover', function() {
      backButton2.setTintFill(0x450000);
    }, this);

    backButton2.on('pointerout', function() {
      backButton2.clearTint();
    }, this);
  }
}
