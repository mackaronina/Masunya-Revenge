import Weapon from "./Weapon.js";

export default class WeaponDrobash extends Weapon {
    constructor(scene) {
        const handsSprite = {
            Player: 4,
            Enemy: 4
        }
        //old offset 140
        //old deviation 0.13
        super(scene, 4, 3, handsSprite, true, false, false, 400, 180, 'drobashsound', 0.112);
    }

    shoot(shooter, target, isPlayer, playEmptySound = true) {
        if (!super.checkShoot(shooter, isPlayer, playEmptySound)) return;
        for (let i = 0; i < 6; i++) {
            let bullet;
            if (isPlayer)
                bullet = this.scene.playerBullets.get();
            else
                bullet = this.scene.enemyBullets.get();
            bullet.fire(shooter, target, this.getDeviation(), this.offset);
        }
        if (isPlayer) this.scene.cameras.main.shake(200 / this.scene.cameras.main.zoom, 0.02 / this.scene.cameras.main.zoom, true);
    }
}