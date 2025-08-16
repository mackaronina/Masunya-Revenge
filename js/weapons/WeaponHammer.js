import Weapon from './Weapon.js';


export default class WeaponHammer extends Weapon {
    constructor(scene) {
        const handsSprite = {
            Player: 2,
            Enemy: 2
        }
        const anims = {
            Player: 'anim_masunya_hammer',
            Enemy: 'anim_necoarc_hammer'
        }
        super({
            scene,
            dropSprite: 4,
            handsSprite,
            isMelee: true,
            cooldown: 300,
            soundName: 'swing_sound',
            isSilent: true,
            anims,
            atackRadius: 62
        });
    }

    static preload(scene) {
        scene.load.audio('swing_sound', 'assets/audio/swing.mp3');
    }
}