import WeaponHands from "./WeaponHands.js";
import Weapon from "./Weapon.js";

export default class WeaponGranata extends Weapon {
    constructor(scene) {
        const handsSprite = {
            Player: 3,
            Enemy: 3
        }
        //old offset 90
        //old deviation 0.03
        super(scene, 1, 0, handsSprite, true, false, false, 2000, 90, 'zamahsound', 0.027, true);
    }

    shoot(shooter, target, isPlayer) {
        if (!super.checkShoot(shooter, isPlayer)) return;
        const grenade = this.scene.grenades.get();
        grenade.fire(shooter, target, this.getDeviation(), isPlayer, this.offset);
        if (this.ammo <= 0 && isPlayer) this.scene.player.inventoryWeapon = new WeaponHands(this.scene);
    }
}