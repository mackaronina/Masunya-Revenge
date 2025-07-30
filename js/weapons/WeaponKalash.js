import Weapon from './Weapon.js';

export default class WeaponKalash extends Weapon {
    constructor(scene) {
        const handsSprite = {
            Player: 5,
            Enemy: 5
        }
        super({
            scene,
            maxAmmo: 20,
            dropSprite: 1,
            handsSprite,
            isSemi: false,
            isAuto: true,
            cooldown: 70,
            offset: 180,
            soundName: 'kalashsound',
            deviation: 0.045
        });
    }
}