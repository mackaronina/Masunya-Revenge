import WeaponHands from './WeaponHands.js';
import Weapon from './Weapon.js';
import WeaponRifle from './WeaponRifle.js';

export default class WeaponGrenade extends Weapon {
    constructor(scene) {
        const handsSprite = {
            Player: 3,
            Enemy: 3
        }
        const anims = {
            Player: 'anim_masunya_grenade',
            Enemy: 'anim_necoarc_grenade',
        }
        super({
            scene,
            maxAmmo: 1,
            dropSprite: 0,
            handsSprite,
            reactionTime: 0,
            cooldown: 2000,
            offset: 153,
            soundName: 'swing_sound',
            isSilent: true,
            anims
        });

    }

    static preload(scene) {
        scene.load.audio('swing_sound', 'assets/audio/swing.mp3');
    }


    createBullets(shooter, target, isPlayer) {
        this.scene.time.delayedCall(200, () => {
            if (!shooter.active) return;
            const grenade = this.scene.grenades.get();
            grenade.fire(shooter, target, this.getDeviation(), isPlayer, this.offset);
        });
    }

    shoot(shooter, target, isPlayer, playEmptySound = false) {
        if (!super.shoot(shooter, target, isPlayer, playEmptySound)) return false;
        if (isPlayer) shooter.inventoryWeapon = new WeaponHands(this.scene);
        else shooter.inventoryWeapon = new WeaponRifle(this.scene);
        return true;
    }
}