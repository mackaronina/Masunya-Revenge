import Enemy from "./Enemy.js";
import {WeaponHands} from "./Weapon.js";
import BloodParticle from "./BloodParticle.js";

export default class Chaos extends Enemy {
    constructor(scene, x, y, angle, pattern) {
        super(scene, x, y, new WeaponHands(scene), angle, pattern);
        this.health = 3;
    }

    meleeCallback(meleeHit) {
        if (!this.active) return;
        if (!meleeHit.checkAngle(this)) return;
        this.agro = true;
    }

    bulletCallback(bulletHit) {
        bulletHit.disableBody(true, true);
        if (!this.active) return;
        this.health -= 1;
        this.agro = true;
        if (this.health <= 0) {
            const frame = Phaser.Math.Between(5, 6);
            this.die(frame, bulletHit);
        } else
            new BloodParticle(this.scene, this.x, this.y);
    }
}