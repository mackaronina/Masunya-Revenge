export default class MeleeHitbox extends Phaser.Physics.Arcade.Sprite {
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
        this.sound = this.scene.sound.add('punch_sound', {loop: false, volume: 0.9});
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