import Weapon from './Weapon.js';


export default class WeaponKuvalda extends Weapon {
    constructor(scene) {
        const handsSprite = {
            Player: 2,
            Enemy: 2
        }
        const anims = {
            Player: 'animMasunyaKuvalda',
            Enemy: 'animNecoarcKuvalda'
        }
        super({
            scene,
            dropSprite: 4,
            handsSprite,
            isMelee: true,
            cooldown: 300,
            soundName: 'zamahsound',
            isSilent: true,
            anims,
            atackRadius: 62
        });
    }
}