import WeaponHands from './WeaponHands.js';
import Weapon from './Weapon.js';
import WeaponDrobash from './WeaponDrobash.js';

export default class WeaponGranata extends Weapon {
    constructor(scene) {
        const handsSprite = {
            Player: 3,
            Enemy: 3
        }
        super({
            scene,
            maxAmmo: 1,
            dropSprite: 0,
            handsSprite,
            reactionTime: 100,
            cooldown: 2000,
            offset: 90,
            soundName: 'zamahsound',
            isSilent: true
        });

    }

    createBullets(shooter, target, isPlayer) {
        const grenade = this.scene.grenades.get();
        grenade.fire(shooter, target, this.getDeviation(), isPlayer, this.offset);
    }

    shoot(shooter, target, isPlayer, playEmptySound = false) {
        if (!super.shoot(shooter, target, isPlayer, playEmptySound)) return false;
        if (isPlayer) shooter.inventoryWeapon = new WeaponHands(this.scene);
        else shooter.inventoryWeapon = new WeaponDrobash(this.scene);
        return true;
    }
}