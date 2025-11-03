import PhysicObject from '../PhysicObject.js';
import config from '../config.js';

export default class MenuMasunyaSpin extends PhysicObject {
    constructor(scene, offset, flip) {
        super(scene, scene.game.config.width / 2 + offset, 540, 'masunya_spin');
        this.depth = config.depth.interface;
        this.setOrigin(0.5);
        this.setScrollFactor(0);
        this.setFlipX(flip);
        this.anims.play('anim_masunya_spin', true);
    }

    static preload(scene) {
        scene.load.spritesheet('masunya_spin', 'assets/images/masunya_spin.png', {frameWidth: 408, frameHeight: 491});
    }

    static createAnims(scene) {
        scene.anims.create({
            key: 'anim_masunya_spin',
            frames: scene.anims.generateFrameNumbers('masunya_spin', {start: 0, end: 28}),
            duration: 1500,
            repeat: -1
        });
    }
}