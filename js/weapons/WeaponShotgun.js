import Weapon from './Weapon.js';

export default class WeaponShotgun extends Weapon {
    constructor(scene) {
        const handsSprite = {
            Player: 4,
            Enemy: 4
        }
        super({
            scene,
            maxAmmo: 4,
            dropSprite: 3,
            handsSprite,
            cooldown: 400,
            offset: 180,
            soundName: 'shotgun_sound',
            deviation: 0.112,
            shakeDuration: 200,
            shakeIntensity: 0.02
        });
        this.countBullets = 6;
    }

    createBullets(shooter, target, isPlayer) {
        for (let i = 0; i < this.countBullets; i++) {
            const bullet = this.getBullet(isPlayer);
            bullet.fire(shooter, target, this.getDeviation(), this.offset);
        }
    }
}