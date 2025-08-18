import PhysicObject from '../PhysicObject.js';
import config from '../config.js';

export default class PatrolCircle extends PhysicObject {
    constructor(owner) {
        super(owner.scene, owner.x, owner.y, null);
        this.visible = false;
        this.setOrigin(0.5);
        this.setSize(80, 80);
        this.setCircle(40);
        this.setScale(3);
        this.owner = owner;
        if (this.owner.angle === 0)
            this.patrolDirection = 1;
        else
            this.patrolDirection = 2;
        this.scene.physics.add.collider(this, this.scene.walls, () => this.collideCallback());
        this.scene.physics.add.collider(this, this.scene.glass, () => this.collideCallback());
        this.scene.physics.add.collider(this, this.scene.brokenglass, () => this.collideCallback());
        this.scene.physics.add.collider(this, this.scene.furniture, () => this.collideCallback());
    }

    collideCallback() {
        if (this.owner.pattern === config.movingPattern.patrol) {
            if (this.patrolDirection === 1) {
                if (this.body.blocked.right)
                    this.owner.dir = Math.PI / 2;
                else if (this.body.blocked.down)
                    this.owner.dir = Math.PI;
                else if (this.body.blocked.left)
                    this.owner.dir = -Math.PI / 2;
                else if (this.body.blocked.up)
                    this.owner.dir = 0;
            } else {
                if (this.body.blocked.right)
                    this.owner.dir = -Math.PI / 2;
                else if (this.body.blocked.down)
                    this.owner.dir = 0;
                else if (this.body.blocked.left)
                    this.owner.dir = Math.PI / 2;
                else if (this.body.blocked.up)
                    this.owner.dir = Math.PI;
            }
        } else if (this.owner.pattern === config.movingPattern.random) {
            let newdir;
            while (true) {
                let deviation = Phaser.Math.Angle.Random() / 2;
                if (this.body.blocked.right) {
                    newdir = Math.PI + deviation;
                } else if (this.body.blocked.down)
                    newdir = -Math.PI / 2 + deviation;
                else if (this.body.blocked.left)
                    newdir = deviation;
                else if (this.body.blocked.up)
                    newdir = Math.PI / 2 + deviation;
                if (this.scene.angleDiff(newdir, Phaser.Math.Angle.Reverse(this.owner.dir)) > Math.PI / 6) break;
            }
            this.owner.dir = newdir;
        }
    }

    update() {
        this.body.velocity = this.owner.body.velocity;
    }
}