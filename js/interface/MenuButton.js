import MenuPic from './MenuPic.js';

export default class MenuButton extends MenuPic {
    constructor(scene, y, sprite, onclick, frame = 0) {
        super(scene, y, sprite, frame);
        this.scene.input.on('pointerdown', () => {
            if (this.active && this.checkReticle()) onclick();
        });
    }

    checkReticle() {
        const rect1 = new Phaser.Geom.Rectangle(
            this.x - this.displayWidth / 2,
            this.y - this.displayHeight / 2,
            this.displayWidth,
            this.displayHeight
        );
        const rect2 = new Phaser.Geom.Rectangle(
            this.scene.cursor.x - this.scene.cursor.displayWidth / 2,
            this.scene.cursor.y - this.scene.cursor.displayHeight / 2,
            this.scene.cursor.displayWidth,
            this.scene.cursor.displayHeight
        );
        return Phaser.Geom.Intersects.RectangleToRectangle(rect1, rect2);
    }

    update() {
        if (this.checkReticle())
            this.setScale(1.05);
        else
            this.setScale(1);
    }
}