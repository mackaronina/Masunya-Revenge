import WeaponGrenade from '../weapons/WeaponGrenade.js';
import PhysicObject from '../PhysicObject.js';

export default class GrenadesBox extends PhysicObject {
    constructor(scene, x, y) {
        super(scene, x, y, 'grenades_box');
        this.setOrigin(0.5);
        this.setScale(3);
        this.depth = 31;
        this.givenGrenades = 0;
        this.maxGrenades = 5;
        this.postFX.addShine(0.5, 0.3, 5);
    }

    static preload(scene) {
        scene.load.image('grenades_box', 'assets/images/grenades_box.png');
    }

    getGrenade() {
        const grenade = new WeaponGrenade(this.scene);
        this.givenGrenades += 1;
        if (this.givenGrenades >= this.maxGrenades)
            this.destroy();
        return grenade;
    }

    isCanInteract() {
        return this.active && this.scene.player && Phaser.Math.Distance.BetweenPoints(this, this.scene.player) < 240
    }
}