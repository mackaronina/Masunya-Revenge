import config from '../config.js';

export default class BaseScene extends Phaser.Scene {
    constructor(params) {
        super(params);
    }

    preload() {
        let progressBox = this.add.graphics();
        let progressBar = this.add.graphics();
        progressBox.fillStyle(0xb464cc, 1);
        const h = this.game.config.height * 0.06;
        const w = this.game.config.width * 0.8;
        const x = this.game.config.width / 2 - w / 2;
        const y = this.game.config.height / 2 - h / 2;
        progressBox.fillRoundedRect(x, y, w, h, 30);

        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0xdd9add, 1);
            progressBar.fillRoundedRect(x + 15, y + 15, (w - 30) * value, h - 30, 16);
        });
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
        });
    }

    create() {
    }

    drawBackground(black = false) {
        const background = this.add.graphics();
        background.depth = config.depth.background;
        if (black)
            background.fillStyle(0x000000);
        else
            background.fillGradientStyle(0x8e44ad, 0x8e44ad, 0x2980b9, 0x2980b9);
        background.fillRect(
            this.cameras.main.centerX - this.cameras.main.displayWidth / 2 - 50,
            this.cameras.main.centerY - this.cameras.main.displayHeight / 2 - 50,
            this.cameras.main.displayWidth + 100,
            this.cameras.main.displayHeight + 100
        );
        background.setScrollFactor(0);
    }

    removeSound() {
        this.game.sound.stopAll();
        this.game.sound.removeAll();
    }

    update(time, delta) {
        this.children.list.forEach((obj) => {
            if (obj.update && obj.active) obj.update(time, delta);
        });
    }
}