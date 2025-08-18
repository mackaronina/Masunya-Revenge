import Enemy from './Enemy.js';
import BloodParticle from './BloodParticle.js';
import WeaponHands from '../weapons/WeaponHands.js';
import config from '../config.js';

export default class Chaos extends Enemy {
    constructor(scene, x, y, angle, pattern) {
        super(scene, x, y, new WeaponHands(scene), angle, pattern);
        this.health = config.chaos.health;
    }

    static createAnims(scene) {
        scene.anims.create({
            key: 'anim_chaos_punch1',
            frames: scene.anims.generateFrameNumbers('necoarc_anims', {start: 9, end: 11}),
            duration: 200,
            repeat: 0
        });
        scene.anims.create({
            key: 'anim_chaos_punch2',
            frames: scene.anims.generateFrameNumbers('necoarc_anims', {start: 12, end: 14}),
            duration: 200,
            repeat: 0
        });
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