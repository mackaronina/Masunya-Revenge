import PhysicObject from '../PhysicObject.js';
import SpillingBloodParticle from './SpillingBloodParticle.js';
import config from '../config.js';

export default class DeadBody extends PhysicObject {
    constructor(scene, x, y, sprite, frame, isAlive) {
        super(scene, x, y, sprite, frame);
        this.setOrigin(1, 0.5);
        this.setScale(2.7);
        this.setCircle(22, this.width - 22, (this.height - 44) / 2);
        this.depth = config.depth.deadBody;
        this.isAlive = isAlive;

        this.scene.physics.add.collider(this, this.scene.walls);
        this.scene.physics.add.collider(this, this.scene.glass);
    }

    static preload(scene) {
        scene.load.spritesheet('body_fatality', 'assets/images/body_fatality.png', {frameWidth: 128, frameHeight: 58});
    }

    static createAnims(scene) {
        scene.anims.create({
            key: 'anim_body_fatality',
            frames: scene.anims.generateFrameNumbers('body_fatality', {start: 0, end: 13}),
            duration: 933,
            repeat: 0
        });
    }

    move(attack) {
        const angle = Phaser.Math.Angle.BetweenPoints(this, attack);
        const vec = this.scene.physics.velocityFromRotation(angle, 900);
        this.setVelocity(-vec.x, -vec.y);
        this.setDrag(Math.abs(vec.x) * 3, Math.abs(vec.y) * 3);
        this.rotation = angle;
    }

    fatality() {
        this.isAlive = false;
        this.anims.play('anim_body_fatality', true);
        this.scene.time.delayedCall(700, () => {
            const rotated = this.scene.rotatePoint(-221, 0, this.rotation);
            new SpillingBloodParticle(this.scene, this.x + rotated.x, this.y + rotated.y);
        });
    }
    
}