import PhysicObject from '../PhysicObject.js';

export default class BloodParticle extends PhysicObject {
    constructor(scene, x, y, forFatality = false) {
        if (!forFatality) {
            const type = Phaser.Math.Between(0, 1);
            super(scene, x, y, 'blood_particle', type);
            this.rotation = Phaser.Math.Angle.Random();
            this.depth = 2;
            if (type === 0)
                this.setScale(Phaser.Math.Between(20, 30) * 0.1);
            else
                this.setScale(Phaser.Math.Between(25, 35) * 0.1);
        } else {
            super(scene, x, y, 'blood_particle', 2);
            this.rotation = Phaser.Math.Angle.Random();
            this.depth = 2;
            this.setScale(0.1);
            this.scene.tweens.add({targets: this, scale: Phaser.Math.Between(25, 35) * 0.1, duration: 400});
        }
    }

    static preload(scene) {
        scene.load.spritesheet('blood_particle', 'assets/images/blood_particle.png', {frameWidth: 64, frameHeight: 64});
    }
}