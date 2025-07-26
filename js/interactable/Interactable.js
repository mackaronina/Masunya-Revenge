export default class Interactable extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(0.5);
        this.setScale(3);
        this.depth = 11;
        this.postFX.addShine(1.3, 5, 10);
        this.visible = false;
        this.scene.physics.add.overlap(this, this.scene.player, () => {
            if (!this.scene.levelCleared || !this.visible) return;
            this.visible = false;
            this.onInteract();
        });
    }

    activate() {
        this.visible = true;
    }

    onInteract() {
    }
}
