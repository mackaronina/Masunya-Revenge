import Cursor from "./Cursor.js";
import MenuButton from "./MenuButton.js";
import BaseScene from "./BaseScene.js";
import MenuMasunyaSpin from "./MenuMasunyaSpin.js";
import MenuPic from "./MenuPic.js";

export default class MenuScene extends BaseScene {
    constructor() {
        super({key: 'MenuScene'})
    }

    preload() {
        super.preload();
        this.load.image('buttonstart', 'assets/images/buttonstart.png');
        this.load.image('cursor', 'assets/images/cursor.png');
        this.load.image('maintitle', 'assets/images/maintitle.png');
        this.load.spritesheet('masunyaspin', 'assets/images/masunyaspin.png', {frameWidth: 408, frameHeight: 491});
        this.load.audio("menuost", "assets/audio/menuost.mp3");
    }

    create() {
        super.create();
        this.sound.add("menuost", {loop: true, volume: 1}).play();
        this.anims.create({
            key: "animMasunyaSpin",
            frames: this.anims.generateFrameNumbers("masunyaspin", {start: 0, end: 28}),
            duration: 3000,
            repeat: -1
        });
        this.cursor = new Cursor(this);
        new MenuMasunyaSpin(this, -550, true);
        new MenuMasunyaSpin(this, 550, false);
        const mainTitle = new MenuPic(this, 150, "maintitle");
        mainTitle.angle = 2;
        this.tweens.add({
            targets: mainTitle,
            angle: -2,
            duration: 1000,
            repeat: -1,
            yoyo: true
        });
        const button = new MenuButton(this, 650, "buttonstart", () => {
            button.disableBody(true, true);
            this.cursor.disableBody(true, true);
            const background = this.add.graphics();
            background.depth = 101;
            background.fillStyle(0x000000);
            background.fillRect(-50, -50, this.game.config.width + 100, this.game.config.height + 100);
            background.setScrollFactor(0);
            const text = "город Северсталь, завод пилка\n\nВ этот день Масюня пошла не только против некоарков,\nно и всего мира";
            const textObj = this.add.text(this.game.config.width / 2, this.game.config.height / 2, '', {
                fontFamily: "Comic Sans MS",
                fontSize: 45,
                fontStyle: 'normal',
                color: "#f5f5f5",
                align: 'center'
            })
            textObj.depth = 102;
            textObj.setOrigin(0.5);
            let counter = 1;
            this.time.addEvent({
                delay: 20,
                callback: () => {
                    const textPart = text.substring(0, counter);
                    textObj.setText(textPart);
                    counter++;
                },
                loop: true
            });
            this.time.delayedCall(1000, () => {
                this.input.on('pointerdown', () => {
                    this.game.sound.stopAll();
                    this.game.sound.removeAll();
                    this.scene.stop('MenuScene')
                    this.scene.start('GameScene');
                });
            });
        });
    }

}