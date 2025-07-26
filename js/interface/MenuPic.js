export default class MenuPic extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, y, sprite, frame = 0) {
        super(scene, scene.game.config.width / 2, y, sprite, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.depth = 99;
        this.setOrigin(0.5);
        this.setScrollFactor(0);
    }
}