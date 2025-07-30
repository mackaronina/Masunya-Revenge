import Weapon from './Weapon.js';


export default class WeaponHands extends Weapon {
    constructor(scene) {
        const handsSprite = {
            Player: 0,
            Enemy: 0,
            Chaos: 6
        }
        const anims = {
            Player: 'animMasunyaPunchFirst',
            Enemy: 'animNecoarcPunchFirst',
            Chaos: 'animChaosPunchFirst'
        }
        super({
            scene,
            handsSprite,
            isMelee: true,
            cooldown: 300,
            soundName: 'zamahsound',
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
            Player: 'animMasunyaPunchFirst',
            Enemy: 'animNecoarcPunchFirst',
            Chaos: 'animChaosPunchFirst'
        }
        else this.anims = {
            Player: 'animMasunyaPunchSecond',
            Enemy: 'animNecoarcPunchSecond',
            Chaos: 'animChaosPunchSecond'
        }
        this.animsFlag = !this.animsFlag;
        return true;
    }
}