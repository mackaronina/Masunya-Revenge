export default class WeaponDrop extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, weapon) {
        super(scene, x, y, 'weapons', weapon.dropSprite);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.weapon = weapon;
        this.setOrigin(0.5);
        this.setScale(3);
        this.setCircle(20, 15, 15);
        this.depth = 13;
        this.scene.physics.add.collider(this, this.scene.walls);
        this.scene.physics.add.collider(this, this.scene.glass);
        this.postFX.addShine(0.5, 0.3, 5);

    }

    pickup() {
        this.destroy();
        return this.weapon;
    }
}