import BloodParticle from './BloodParticle.js';

export default class SpillingBloodParticle extends BloodParticle {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.setFrame(2);
        this.setScale(0.1);
        this.scene.tweens.add({targets: this, scale: Phaser.Math.Between(25, 35) * 0.1, duration: 400});
    }
}