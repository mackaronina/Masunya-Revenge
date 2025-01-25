import Entity from "./Entity.js";
import PatrolCircle from "./PatrolCircle.js";

export default class Enemy extends Entity {
    constructor(scene, x, y, weapon, angle, pattern) {
        super(scene, x, y, 'necoarc', 'necoarcdead');
        this.inventoryWeapon = weapon;
        this.seePlayer = false;
        this.seeTime = 0;
        this.agro = false;
        this.dir = Phaser.Math.DegToRad(angle);
        this.angle = angle;
        this.pattern = pattern;
        this.patrolCircle = new PatrolCircle(this);
        this.lastPath = null;
        /*
        PATTERNS:
        "patrol"
        "random"
        "stand"
        "static"
        */
        this.scene.physics.add.collider(this, this.scene.playerBullets, (a, bulletHit) => this.bulletCallback(bulletHit));
        this.scene.physics.add.overlap(this, this.scene.playerHitboxes, (a, meleeHit) => this.meleeCallback(meleeHit));
        this.scene.physics.add.collider(this, this.scene.player, () => {
            this.agro = true
            this.scene.player.setVelocity(0);
        });
    }

    checkSeePlayer() {
        if (this.scene.angleDiff(Phaser.Math.Angle.BetweenPoints(this, this.scene.player), this.rotation) < Math.PI / 3) {
            return this.scene.checkWalls(this, this.scene.player);
        } else
            return false;
    }

    moveToPlayer() {
        if (this.patrolCircle.active) this.patrolCircle.destroy();
        let path = this.scene.navMesh.findPath({
            x: Math.round(this.x / 3),
            y: Math.round(this.y / 3)
        }, {
            x: Math.round(this.scene.player.x / 3),
            y: Math.round(this.scene.player.y / 3)
        });
        let angle;
        if (!path) {
            angle = Phaser.Math.Angle.BetweenPoints(this, this.scene.player);
        } else {
            angle = Phaser.Math.Angle.BetweenPoints(this, {
                x: path[1].x * 3,
                y: path[1].y * 3,
            });
        }
        const vec = this.scene.physics.velocityFromRotation(angle, this.entitySpeed);
        this.setVelocity(vec.x, vec.y);
        this.rotation = angle;
        /*
        const graphics = this.scene.graphics;
        graphics.clear();
        graphics.lineStyle(2, 0xff0000, 1);
        graphics.beginPath();
        graphics.moveTo(path[0].x * 3, path[0].y * 3);
        for (let idx = 1; idx < path.length; idx++) {
            graphics.lineTo(path[idx].x * 3, path[idx].y * 3);
        }
        graphics.strokePath();
         */
    }

    update(time) {
        super.update();
        if (!this.scene.player.active) {
            this.setVelocity(0, 0);
            return;
        }
        if (this.checkSeePlayer()) {
            if (!this.seePlayer) {
                this.seePlayer = true;
                this.seeTime = time;
                this.agro = true;
            }
        } else {
            this.seePlayer = false;
        }
        if (this.seePlayer) {
            if (!this.inventoryWeapon.isMelee) {
                this.setVelocity(0, 0);
                this.rotation = Phaser.Math.Angle.BetweenPoints(this, this.scene.player);
                const dir = {
                    x: this.scene.player.x + this.scene.player.body.velocity.x * 0.1,
                    y: this.scene.player.y + this.scene.player.body.velocity.y * 0.1
                }
                if (time - this.seeTime > 350)
                    this.inventoryWeapon.shoot(this, dir, false);
            } else {
                if (Phaser.Math.Distance.BetweenPoints(this, this.scene.player) < this.body.radius * this.scale + this.inventoryWeapon.atackRadius * 3 * 0.9)
                    this.inventoryWeapon.shoot(this, null, false);
                this.moveToPlayer();
            }
        } else if (this.agro) {
            if (this.pattern !== "static")
                this.moveToPlayer();
            else
                this.agro = false;
        } else {
            if (this.pattern === "patrol" || this.pattern === "random") {
                const vec = this.scene.physics.velocityFromRotation(this.dir, this.entitySlowSpeed);
                this.setVelocity(vec.x, vec.y);
                this.rotation = this.body.angle;
            }
        }
    }

    meleeCallback(meleeHit) {
        if (!super.meleeCallback(meleeHit)) return;
        if (meleeHit.isLethal) {
            const frame = Phaser.Math.Between(3, 4);
            this.die(frame, meleeHit);
        } else {
            const body = this.die(0, meleeHit, true);
            this.agro = true;
            this.pattern = "stand";
            this.anims.stop();
            this.scene.time.delayedCall(3000, () => {
                if (body.isAlive) {
                    this.enableBody(true, body.x, body.y, true, true);
                    body.allDestroy();
                }
            });
        }
    }
}
