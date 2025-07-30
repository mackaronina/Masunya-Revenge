import Weapon from './Weapon.js';

export default class WeaponMakarov extends Weapon {
    constructor(scene) {
        const handsSprite = {
            Player: 1,
            Enemy: 1
        }
        super({
            scene,
            maxAmmo: 8,
            dropSprite: 2,
            handsSprite,
            cooldown: 150,
            offset: 114,
            soundName: 'makarovsound',
            deviation: 0.027
        });
    }
}