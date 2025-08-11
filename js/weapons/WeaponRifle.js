import Weapon from './Weapon.js';

export default class WeaponRifle extends Weapon {
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
            soundName: 'rifle_sound',
            deviation: 0.045
        });
    }

    static preload(scene) {
        scene.load.audio('rifle_sound', 'assets/audio/rifle.mp3');
    }
}