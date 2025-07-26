export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
        super(scene, 0, 0, 'bullet');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(0.5);
        this.setCircle(2, 7, 7);
        this.setScale(3);
        this.depth = 16;
        this.defaultSpeed = 4500;
        this.startTime = scene.time.now;
        this.scene.physics.add.collider(this, this.scene.walls, () => {
            if (this.body.bounce.x === 0) this.disableBody(true, true);
        });
        this.scene.physics.add.overlap(this, this.scene.glass, (a, glassHit) => this.scene.destroyGlass(glassHit));
    }

    fire(shooter, target, deviation, offset = 0, grenade = false) {
        let direction;
        this.startTime = this.scene.time.now;
        const speed = Phaser.Math.Between(this.defaultSpeed * 0.9, this.defaultSpeed * 1.1);
        if (!grenade) {
            //const rotated = this.scene.rotatePoint(offset, 0, shooter.rotation);
            //const startX = shooter.x + rotated.x;
            //const startY = shooter.y + rotated.y;
            const startX = shooter.x;
            const startY = shooter.y;
            this.enableBody(true, startX, startY, true, true);
            direction = Phaser.Math.Angle.BetweenPoints(shooter, target) + deviation;
        } else {
            this.enableBody(true, shooter.x, shooter.y, true, true);
            direction = deviation;
        }
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
