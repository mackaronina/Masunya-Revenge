export default class MenuMasunyaSpin extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, offset, flip) {
        super(scene, scene.game.config.width / 2 + offset, 540, 'masunyaspin');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.depth = 99;
        this.setOrigin(0.5);
        this.setScrollFactor(0);
        this.setFlipX(flip);
        this.anims.play('animMasunyaSpin', true);
    }
}