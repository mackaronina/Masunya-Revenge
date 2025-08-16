import Bullet from './Bullet.js';

export default class Grenade extends Bullet {
    constructor(scene) {
        super(scene);
        this.setTexture('grenade');
        this.setCircle(10, 25, 25);
        this.setScale(3);
        this.defaultSpeed = 2000;
        this.explosionTime = 1500;
        this.countBullets = 32;
        this.sound = this.scene.sound.add('explosion_sound', {loop: false, volume: 0.5});
    }

    static preload(scene) {
        scene.load.image('grenade', 'assets/images/grenade.png');
        scene.load.spritesheet('explosion', 'assets/images/explosion.png', {frameWidth: 70, frameHeight: 70});
        scene.load.audio('explosion_sound', 'assets/audio/explosion.mp3');
    }

    static createAnims(scene) {
        scene.anims.create({
            key: 'anim_explosion',
            frames: scene.anims.generateFrameNumbers('explosion'),
            duration: 123,
            repeat: 0
        });
    }

    fire(shooter, target, deviation, isPlayer, offset) {
        super.fire(shooter, target, deviation, offset);
        this.setBounce(1);
        this.isPlayer = isPlayer;
    }

    update(time) {
        if (this.anims.isPlaying) return;
        super.update(time);
        this.rotation += 6;
        if (time - this.startTime >= this.explosionTime) this.explode();
    }

    explode() {
        for (let i = 0; i < Math.PI * 2; i += (Math.PI * 2) / this.countBullets) {
            const bullet = this.isPlayer ? this.scene.playerBullets.get() : this.scene.enemyBullets.get();
            bullet.fire(this, this, i, 0);
        }
        this.setVelocity(0, 0);
        this.anims.play('anim_explosion', true).once('animationcomplete', () => {
            this.disableBody(true, true);
            this.setTexture('grenade');
        });
        this.scene.cameras.main.shake(200 / this.scene.cameras.main.zoom, 0.02 / this.scene.cameras.main.zoom, true);
        this.sound.play();
        if (this.isPlayer) this.scene.makeNoise(this);
    }
}