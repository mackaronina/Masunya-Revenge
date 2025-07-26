import Weapon from "./Weapon.js";

export default class WeaponKalash extends Weapon {
    constructor(scene) {
        const handsSprite = {
            Player: 5,
            Enemy: 5
        }
        //old offset 140
        //old deviation 0.05
        super(scene, 20, 1, handsSprite, false, true, false, 70, 180, 'kalashsound', 0.045);
    }
}