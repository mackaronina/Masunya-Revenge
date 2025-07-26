import MeleeHitbox from "../projectiles/MeleeHitbox.js";
import Weapon from "./Weapon.js";


export default class WeaponKuvalda extends Weapon {
    constructor(scene) {
        const handsSprite = {
            Player: 2,
            Enemy: 2
        }
        const anims = {
            Player: "animMasunyaKuvalda",
            Enemy: "animNecoarcKuvalda"
        }
        super(scene, 0, 4, handsSprite, true, false, true, 300, 0, 'zamahsound', 0, true, false, anims, 62);
    }

    shoot(shooter, target, isPlayer) {
        if (!super.checkShoot(shooter, isPlayer)) return;
        this.scene.time.delayedCall(100, () => {
            if (!shooter.active) return;
            if (isPlayer)
                this.scene.playerHitboxes.add(new MeleeHitbox(this.scene, shooter, true, this.atackRadius));
            else
                this.scene.enemyHitboxes.add(new MeleeHitbox(this.scene, shooter, true, this.atackRadius));
        });
    }
}