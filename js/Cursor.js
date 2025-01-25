export default class Cursor extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
        super(scene, 0, 0, 'cursor');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(0.5);
        this.setScale(3 / this.scene.cameras.main.zoom);
        this.depth = 100;
        this.x = this.scene.cameras.main.worldView.centerX;
        this.y = this.scene.cameras.main.worldView.centerY;
        this.scene.input.on('pointermove', (pointer) => {
            const rect = this.scene.cameras.main.worldView;
            if (Phaser.Geom.Rectangle.Contains(rect, this.x + pointer.movementX, this.y)) this.x += pointer.movementX;
            if (Phaser.Geom.Rectangle.Contains(rect, this.x, this.y + pointer.movementY)) this.y += pointer.movementY;
        });
    }
}