export default class Reticle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
        super(scene, 0, 0, 'crosshair');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(0.5);
        this.setScale(3 / this.scene.cameras.main.zoom);
        this.x = this.scene.player.x + 1;
        this.y = this.scene.player.y + 1;
        this.scene.time.delayedCall(50, () => {
            this.x = this.scene.player.x + 1;
            this.y = this.scene.player.y + 1;
        });
        this.depth = 100;
        this.scene.input.on('pointermove', (pointer) => {
            const coef = 1.25;
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
            const dx = this.scene.player.body.position.x - this.scene.player.body.prev.x;
            const dy = this.scene.player.body.position.y - this.scene.player.body.prev.y;
            this.x += dx * 1;
            this.y += dy * 1;

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
}
