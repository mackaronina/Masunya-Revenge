import PhysicObject from '../PhysicObject.js';
import config from '../config.js';

export default class Bullet extends PhysicObject {
    constructor(scene) {
        super(scene, 0, 0, 'bullet');
        this.defaultSpeed = config.bullet.speed;
        this.setOrigin(0.5);
        this.setCircle(2, 7, 7);
        this.setScale(3);
        this.depth = config.depth.bullet;
        this.startTime = scene.time.now;
        this.scene.physics.add.collider(this, this.scene.walls, () => {
            if (this.body.bounce.x === 0) this.disableBody(true, true);
        });
        this.scene.physics.add.overlap(this, this.scene.glass, (a, glassHit) => this.scene.destroyGlass(glassHit));
    }

    static preload(scene) {
        scene.load.image('bullet', 'assets/images/bullet.png');
    }

    fire(shooter, target, deviation, offset = 0) {
        this.startTime = this.scene.time.now;
        const speed = Phaser.Math.Between(this.defaultSpeed * 0.9, this.defaultSpeed * 1.1);
        this.enableBody(true, shooter.x, shooter.y, true, true);
        const direction = Phaser.Math.Angle.BetweenPoints(shooter, target) + deviation;
        this.rotation = direction;
        const vec = this.scene.physics.velocityFromRotation(direction, speed);
        this.setVelocity(vec.x, vec.y);
        this.visible = false;
        this.shooter = shooter;
        this.offset = offset;
    }

    update(time) {
        if (time - this.startTime >= 3000) this.disableBody(true, true);
        if (this.active) {
            const dist = Phaser.Math.Distance.BetweenPoints(this, this.shooter);
            if (dist >= this.offset) this.visible = true;
        }
    }
}
