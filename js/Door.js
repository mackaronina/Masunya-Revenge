export default class Door extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, orientation, frame) {
        super(scene, x, y, 'door' + orientation, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(0);
        this.setScale(3);
        this.depth = 30;
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