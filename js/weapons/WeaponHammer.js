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

    static createAnims(scene) {
        scene.anims.create({
            key: 'anim_masunya_hammer',
            frames: scene.anims.generateFrameNumbers('masunya_anims', {start: 6, end: 8}),
            duration: 200,
            repeat: 0
        });
        scene.anims.create({
            key: 'anim_necoarc_hammer',
            frames: scene.anims.generateFrameNumbers('necoarc_anims', {start: 6, end: 8}),
            duration: 200,
            repeat: 0
        });
    }
}