import Bullet from './Bullet.js';

export default class Grenade extends Bullet {
    constructor(scene) {
        super(scene);
        this.setTexture('weapons', 0);
        this.setCircle(10, 25, 25);
        this.setScale(3);
        this.defaultSpeed = 2500;
        this.countBullets = 32;
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
        super.update(time);
        this.rotation += 6;
        if (time - this.startTime >= 1000) this.explode();
    }

    explode() {
        for (let i = 0; i < Math.PI * 2; i += (Math.PI * 2) / this.countBullets) {
            const bullet = this.isPlayer ? this.scene.playerBullets.get() : this.scene.enemyBullets.get();
            bullet.fire(this, this, i, 0);
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