import Weapon from './Weapon.js';

export default class WeaponMakarov extends Weapon {
    constructor(scene) {
        const handsSprite = {
            Player: 1,
            Enemy: 1
        }
        //old offset 90
        //old deviation 0.03
        super(scene, 8, 2, handsSprite, true, false, false, 150, 114, 'makarovsound', 0.027);
    }
}