import WeaponGrenade from '../weapons/WeaponGrenade.js';

export default class GrenadesBox extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'grenades_box');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(0.5);
        this.setScale(3);
        this.depth = 31;
        this.givenGrenades = 0;
        this.maxGrenades = 5;
        this.postFX.addShine(0.5, 0.3, 5);
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