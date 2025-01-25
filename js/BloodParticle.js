export default class BloodParticle extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, forFatality = false) {
        if (!forFatality) {
            const type = Phaser.Math.Between(0, 1);
            super(scene, x, y, 'bloodparticle', type);
            scene.add.existing(this);
            scene.physics.add.existing(this);
            this.rotation = Phaser.Math.Angle.Random();
            this.depth = 2;
            if (type === 0)
                this.setScale(Phaser.Math.Between(20, 30) * 0.1);
            else
                this.setScale(Phaser.Math.Between(25, 35) * 0.1);
        } else {
            super(scene, x, y, 'bloodparticle', 2);
            scene.add.existing(this);
            scene.physics.add.existing(this);
            this.rotation = Phaser.Math.Angle.Random();
            this.depth = 2;
            this.setScale(0.1);
            this.scene.tweens.add({targets: this, scale: Phaser.Math.Between(25, 35) * 0.1, duration: 400});
        }
    }
}