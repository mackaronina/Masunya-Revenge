import MeleeHitbox from '../projectiles/MeleeHitbox.js';
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
        super(scene, 0, -1, handsSprite, true, false, true, 300, 0, 'zamahsound', 0, true, true, anims, 54);
        this.flag = false;
    }

    drop(x, y) {
    }

    shoot(shooter, target, isPlayer) {
        if (!super.checkShoot(shooter, isPlayer)) return;
        this.scene.time.delayedCall(100, () => {
            if (!shooter.active) return;
            if (isPlayer)
                this.scene.playerHitboxes.add(new MeleeHitbox(this.scene, shooter, false, this.atackRadius));
            else
                this.scene.enemyHitboxes.add(new MeleeHitbox(this.scene, shooter, false, this.atackRadius));
        });
        if (this.flag) {
            this.anims = {
                Player: 'animMasunyaPunchFirst',
                Enemy: 'animNecoarcPunchFirst',
                Chaos: 'animChaosPunchFirst'
            }
        } else {
            this.anims = {
                Player: 'animMasunyaPunchSecond',
                Enemy: 'animNecoarcPunchSecond',
                Chaos: 'animChaosPunchSecond'
            }
        }
        this.flag = !this.flag;
    }
}