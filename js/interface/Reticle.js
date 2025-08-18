import PhysicObject from '../PhysicObject.js';
import config from '../config.js';

export default class Reticle extends PhysicObject {
    constructor(scene) {
        super(scene, 0, 0, 'crosshair');
        this.setOrigin(0.5);
        this.setScale(3 / this.scene.cameras.main.zoom);
        this.scene.time.delayedCall(50, () => {
            this.x = this.scene.player.x + 1;
            this.y = this.scene.player.y + 1;
        });
        this.depth = config.depth.cursor;
        this.scene.input.on('pointermove', (pointer) => {
            const coef = config.mouseSensitivity;
            if (!this.active || !this.scene) return;
            if (Math.abs(this.scene.cameras.main.worldView.centerX
                - (this.x + pointer.movementX * coef)) < this.scene.cameras.main.displayWidth / 2)
                this.x += pointer.movementX * coef;
            if (Math.abs(this.scene.cameras.main.worldView.centerY
                - (this.y + pointer.movementY * coef)) < this.scene.cameras.main.displayHeight / 2)
                this.y += pointer.movementY * coef;
        });
        this.scene.events.on('postupdate', () => {
            if (!this.active || !this.scene || !this.scene.player.active) return;
            const dx = this.scene.player.x - this.scene.player.prev_x;
            const dy = this.scene.player.y - this.scene.player.prev_y;
            this.x += dx;
            this.y += dy;

            const rect = this.scene.cameras.main.worldView;
            if (!rect.contains(this.x, this.y)) {
                const points = [];
                const line = new Phaser.Geom.Line(this.x, this.y, this.scene.cameras.main.worldView.centerX, this.scene.cameras.main.worldView.centerY);
                Phaser.Geom.Intersects.GetLineToRectangle(line, rect, points);
                if (points.length > 0) {
                    this.x = points[0].x;
                    this.y = points[0].y;
                }
            }

        });
    }

    static preload(scene) {
        scene.load.image('crosshair', 'assets/images/crosshair.png');
    }
}