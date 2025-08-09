export default class PhysicObject extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture = null, frame = null) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
}