import Weapon from './Weapon.js';


export default class WeaponHands extends Weapon {
    constructor(scene) {
        const handsSprite = {
            Player: 0,
            Enemy: 0,
            Chaos: 6
        }
        const anims = {
            Player: 'anim_masunya_punch1',
            Enemy: 'anim_necoarc_punch1',
            Chaos: 'anim_chaos_punch1'
        }
        super({
            scene,
            handsSprite,
            isMelee: true,
            cooldown: 300,
            soundName: 'swing_sound',
            isSilent: true,
            anims,
            atackRadius: 54,
            isLethal: false,
        });
        this.animsFlag = false;
    }

    drop(x, y) {
    }

    shoot(shooter, target, isPlayer, playEmptySound = false) {
        if (!super.shoot(shooter, target, isPlayer, playEmptySound)) return false;
        if (this.animsFlag) this.anims = {
            Player: 'anim_masunya_punch1',
            Enemy: 'anim_necoarc_punch1',
            Chaos: 'anim_chaos_punch1'
        }
        else this.anims = {
            Player: 'anim_masunya_punch2',
            Enemy: 'anim_necoarc_punch2',
            Chaos: 'anim_chaos_punch2'
        }
        this.animsFlag = !this.animsFlag;
        return true;
    }
}