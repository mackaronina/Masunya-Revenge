import BloodParticle from "./BloodParticle.js";

export default class DeadBody extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite, frame, isAlive) {
        super(scene, x, y, sprite, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(1, 0.5);
        this.setScale(2.7);
        this.setCircle(22, this.width - 22, (this.height - 44) / 2);
        this.depth = 12;
        this.isAlive = isAlive;

        this.components = [this];
        for (let i = 0; i < 20; i++) {
            const component = this.scene.physics.add.sprite();
            component.setSize(44, 44);
            component.setCircle(22);
            component.setScale(2.7);
            this.components.push(component);
        }

        const collideCallback = (comp) => {
            const v = comp.body.velocity;
            this.components.forEach(component => {
                component.body.velocity.copy(v);
            })
        }
        this.scene.physics.add.collider(this.components, this.scene.walls, collideCallback);
        this.scene.physics.add.collider(this.components, this.scene.glass, collideCallback);
    }

    move(attack) {
        const angle = Phaser.Math.Angle.BetweenPoints(this, attack);
        const vec = this.scene.physics.velocityFromRotation(angle, 900);
        this.setVelocity(-vec.x, -vec.y);
        this.setDrag(Math.abs(vec.x) * 3, Math.abs(vec.y) * 3);
        this.rotation = angle;
        this.scene.time.delayedCall(1500, () => {
            this.components.forEach(component => {
                if (component !== this) component.disableBody(true, true)
            });
        });
    }

    update() {
        if (!this.active) return;
        for (let i = 1; i < 21; i++) {
            const rotated = this.scene.rotatePoint(-13 * i, 0, this.rotation);
            this.components[i].body.position.set(
                this.body.x + rotated.x,
                this.body.y + rotated.y
            );
        }

        this.components.forEach(component => component.body.velocity.copy(this.body.velocity));
    }

    fatality() {
        this.isAlive = false;
        this.anims.play('animBodyFatality', true);
        this.scene.time.delayedCall(700, () => {
            const rotated = this.scene.rotatePoint(-221, 0, this.rotation);
            new BloodParticle(this.scene, this.x + rotated.x, this.y + rotated.y, true);
        });
    }

    allDestroy() {
        this.components.forEach(component => component.destroy());
    }
}