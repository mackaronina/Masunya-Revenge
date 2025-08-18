import PhysicObject from '../PhysicObject.js';
import config from '../config.js';

export default class Cursor extends PhysicObject {
    constructor(scene) {
        super(scene, 0, 0, 'cursor');
        this.setOrigin(0.5);
        this.setScale(3);
        this.depth = config.depth.cursor;
        this.x = this.scene.cameras.main.worldView.centerX;
        this.y = this.scene.cameras.main.worldView.centerY;
        this.scene.input.on('pointermove', (pointer) => {
            if (!this.active) return;
            const rect = this.scene.cameras.main.worldView;
            if (Phaser.Geom.Rectangle.Contains(rect, this.x + pointer.movementX, this.y)) this.x += pointer.movementX;
            if (Phaser.Geom.Rectangle.Contains(rect, this.x, this.y + pointer.movementY)) this.y += pointer.movementY;
        });
    }

    static preload(scene) {
        scene.load.image('cursor', 'assets/images/cursor.png');
    }
}