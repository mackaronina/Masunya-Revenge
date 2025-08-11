import Weapon from './Weapon.js';

export default class WeaponPistol extends Weapon {
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
            soundName: 'pistol_sound',
            deviation: 0.027
        });
    }

    static preload(scene) {
        scene.load.audio('pistol_sound', 'assets/audio/pistol.mp3');
    }
}