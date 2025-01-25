export class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
        super(scene, 0, 0, 'bullet');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(0.5);
        this.setCircle(2, 7, 7);
        this.setScale(3);
        this.depth = 25;
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
            const rotated = this.scene.rotatePoint(offset, 0, shooter.rotation);
            const startX = shooter.x + rotated.x;
            const startY = shooter.y + rotated.y;
            this.enableBody(true, startX, startY, true, true);
            direction = Phaser.Math.Angle.BetweenPoints(shooter, target) + deviation;
        } else {
            this.enableBody(true, shooter.x, shooter.y, true, true);
            direction = deviation;
        }
        this.rotation = direction;
        const vec = this.scene.physics.velocityFromRotation(direction, speed);
        this.setVelocity(vec.x, vec.y);
    }

    update(time) {
        if (time - this.startTime >= 3000) this.disableBody(true, true);
    }
}

export class Grenade extends Bullet {
    constructor(scene) {
        super(scene);
        this.setTexture('weapons', 0);
        this.setCircle(10, 25, 25);
        this.setScale(3);
        this.defaultSpeed = 1500;
        this.isPlayer = false;
        this.sound = this.scene.sound.add('explosionsound', {loop: false, volume: 0.5});
    }

    fire(shooter, target, deviation, isPlayer, offset) {
        this.setTexture('weapons', 0);
        super.fire(shooter, target, deviation, offset);
        this.setBounce(1);
        this.isPlayer = isPlayer;
    }

    update(time) {
        if (this.anims.isPlaying) return;
        this.rotation += 6;
        if (time - this.startTime >= 2000) {
            for (let i = 0; i < Math.PI * 2; i += (Math.PI * 2) / 24) {
                let bullet;
                if (this.isPlayer)
                    bullet = this.scene.playerBullets.get();
                else
                    bullet = this.scene.enemyBullets.get();
                bullet.fire(this, this, i, 0, true);
            }
            this.setVelocity(0, 0);
            this.anims.play('animExplosion', true).once('animationcomplete', () => {
                this.disableBody(true, true);
            });
            this.scene.cameras.main.shake(200 / this.scene.cameras.main.zoom, 0.02 / this.scene.cameras.main.zoom, true);
            this.sound.play();
            if (this.isPlayer) this.scene.makeNoise(this);
        }
    }
}

export class MeleeHitbox extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, owner, isLethal, atackRadius) {
        super(scene, owner.x, owner.y, null);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.visible = false;
        this.setOrigin(0.5);
        this.setSize(atackRadius * 2, atackRadius * 2);
        this.setCircle(atackRadius);
        this.setScale(3);
        this.owner = owner;
        this.startTime = scene.time.now;
        this.isLethal = isLethal;
        this.sound = this.scene.sound.add('punchsound', {loop: false, volume: 0.9});
        this.scene.physics.add.overlap(this, this.scene.glass, (a, glassHit) => {
            const pointX = glassHit.x * 48 + 24;
            const pointY = glassHit.y * 48 + 24;
            if (this.checkAngle({x: pointX, y: pointY}, false, Math.PI / 8))
                this.scene.destroyGlass(glassHit)
        });
    }

    checkAngle(target, checkGlass = true, atackRadius = Math.PI / 4) {
        if (this.scene.angleDiff(Phaser.Math.Angle.BetweenPoints(this, target), this.owner.rotation) < atackRadius) {
            return this.scene.checkWalls(this, target, checkGlass);
        } else
            return false;
    }

    update(time) {
        if (time - this.startTime >= 100) this.destroy();
        if (this.owner && this.owner.body) {
            this.x = this.owner.x + this.owner.body.velocity.x / 30;
            this.y = this.owner.y + this.owner.body.velocity.y / 30;
        } else {
            this.destroy();
        }
    }
}