export default class MenuPic extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, y, sprite, frame = 0) {
        const newY = scene.cameras.main.centerY + (y - scene.game.config.height / 2) / scene.cameras.main.zoom;
        super(scene, scene.cameras.main.centerX, newY, sprite, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.startY = y;
        this.depth = 99;
        this.setOrigin(0.5);
        this.setScrollFactor(0);
        this.setScale(1 / this.scene.cameras.main.zoom);
    }
}