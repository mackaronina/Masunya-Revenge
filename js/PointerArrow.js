export default class PointerArrow extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
        super(scene, 0, 0, "pointerarrow");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(0.5);
        this.setScale(3 / this.scene.cameras.main.zoom);
        this.setVisible(false);
        this.depth = 99;
        this.dist = 180;
        this.scene.tweens.add({
            delay: 60,
            targets: this,
            dist: {value: '+=10'},
            duration: 300,
            repeat: -1,
            yoyo: true
        });
    }

    update() {
        if (!this.scene.currentTarget) return;
        const dir = Phaser.Math.Angle.BetweenPoints(this, this.scene.currentTarget);
        const rotated = this.scene.rotatePoint(this.dist, 0, dir);
        this.x = this.scene.player.x + rotated.x;
        this.y = this.scene.player.y + rotated.y;
        this.rotation = dir;
        this.setVisible(Phaser.Math.Distance.BetweenPoints(this, this.scene.currentTarget) > 600);
    }
}