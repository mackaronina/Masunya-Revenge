import MenuPic from "./MenuPic.js";

export default class MenuButton extends MenuPic {
    constructor(scene, y, sprite, onclick, frame = 0) {
        super(scene, y, sprite, frame);
        this.scene.input.on('pointerdown', () => {
            if (this.checkReticle() && this.active) onclick();
        });
    }

    checkReticle() {
        const newY = this.scene.cameras.main.worldView.centerY + (this.startY - this.scene.game.config.height / 2) / this.scene.cameras.main.zoom;
        const rect1 = new Phaser.Geom.Rectangle(
            this.scene.cameras.main.worldView.centerX - this.displayWidth / 2,
            newY - this.displayHeight / 2,
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
            this.setScale(1.05 / this.scene.cameras.main.zoom);
        else
            this.setScale(1 / this.scene.cameras.main.zoom);
    }
}