import PhysicObject from '../PhysicObject.js';
import config from '../config.js';

export default class WeaponDrop extends PhysicObject {
    constructor(scene, x, y, weapon) {
        super(scene, x, y, 'weapons', weapon.dropSprite);
        this.weapon = weapon;
        this.setOrigin(0.5);
        this.setScale(3);
        this.setCircle(20, 15, 15);
        this.depth = config.depth.droppedWeapon;
        this.scene.physics.add.collider(this, this.scene.walls);
        this.scene.physics.add.collider(this, this.scene.glass);
        this.postFX.addShine(0.5, 0.3, 5);

    }

    static preload(scene) {
        scene.load.spritesheet('weapons', 'assets/images/weapons.png', {frameWidth: 70, frameHeight: 70});
    }

    isCanInteract() {
        return this.active && this.scene.player && Phaser.Math.Distance.BetweenPoints(this, this.scene.player) < 162
    }

    pickup() {
        this.destroy();
        return this.weapon;
    }
}