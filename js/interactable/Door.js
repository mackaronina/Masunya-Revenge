import PhysicObject from '../PhysicObject.js';
import config from '../config.js';

export default class Door extends PhysicObject {
    constructor(scene, x, y, orientation, frame) {
        super(scene, x, y, `door_${orientation}`, frame);
        this.setOrigin(0);
        this.setScale(3);
        this.depth = config.depth.doors;
        this.openTime = 0;
        this.colliders = [];
        this.scene.physics.add.overlap(this, this.scene.player, () => this.overlapEntity());
        this.scene.physics.add.overlap(this, this.scene.enemies, () => this.overlapEntity());
        this.colliders.push(this.scene.physics.add.collider(this, this.scene.playerBullets, (a, bulletHit) => bulletHit.disableBody(true, true)));
        this.colliders.push(this.scene.physics.add.collider(this, this.scene.enemyBullets, (a, bulletHit) => bulletHit.disableBody(true, true)));
        this.colliders.push(this.scene.physics.add.collider(this, this.scene.droppedWeapons));
        this.colliders.push(this.scene.physics.add.collider(this, this.scene.deadBodies));
        this.colliders.push(this.scene.physics.add.collider(this, this.scene.grenades));
    }

    static preload(scene) {
        scene.load.spritesheet('door_vertical', 'assets/images/door_vertical.png', {frameWidth: 16, frameHeight: 64});
        scene.load.spritesheet('door_horizontal', 'assets/images/door_horizontal.png', {
            frameWidth: 64,
            frameHeight: 16
        });
    }

    overlapEntity() {
        if (!this.active) return;
        const touching = !this.body.touching.none || this.body.embedded;
        if (touching) {
            this.openTime = this.scene.time.now;
            this.visible = false;
            this.colliders.forEach(collider => {
                collider.active = false;
            });
        }
    }

    update(time) {
        const touching = !this.body.touching.none || this.body.embedded;
        if (!touching && time - this.openTime > 200) {
            this.visible = true;
            this.colliders.forEach(collider => {
                collider.active = true;
            });
        }
    }
}