export default class EndArrow extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, angle) {
        super(scene, x, y);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(0.5);
        this.visible = false;
        this.setSize(96 * 2, 96 * 2);
        this.setCircle(96)

        this.arrow = this.scene.physics.add.sprite(this.x, this.y, 'arrow');
        this.arrow.setOrigin(0.5);
        this.arrow.setScale(3);
        this.arrow.depth = 19;
        this.arrow.visible = false;
        this.arrow.angle = angle;

        this.dist = 0;

        this.scene.tweens.add({
            delay: 100,
            targets: this,
            dist: {value: '+=32'},
            duration: 500,
            repeat: -1,
            yoyo: true
        });
        this.scene.physics.add.overlap(this, this.scene.player, () => {
            if (this.scene.levelCleared) this.scene.nextLevel();
        });
    }

    update() {
        const rotated = this.scene.rotatePoint(this.dist, 0, this.arrow.rotation);
        this.arrow.x = this.x + rotated.x;
        this.arrow.y = this.y + rotated.y;
    }

    activate() {
        this.arrow.visible = true;
    }
}