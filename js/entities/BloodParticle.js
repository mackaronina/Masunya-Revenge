import PhysicObject from '../PhysicObject.js';
import config from '../config.js';

export default class BloodParticle extends PhysicObject {
    constructor(scene, x, y) {
        const spriteIndex = Phaser.Math.Between(0, 1);
        super(scene, x, y, 'blood_particle', spriteIndex);
        const scales = {
            0: Phaser.Math.Between(20, 30) * 0.1,
            1: Phaser.Math.Between(25, 35) * 0.1
        }
        this.setScale(scales[spriteIndex]);
        this.rotation = Phaser.Math.Angle.Random();
        this.depth = config.depth.blood;
    }

    static preload(scene) {
        scene.load.spritesheet('blood_particle', 'assets/images/blood_particle.png', {frameWidth: 64, frameHeight: 64});
    }
}