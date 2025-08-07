import WeaponDrop from './WeaponDrop.js';
import MeleeHitbox from '../projectiles/MeleeHitbox.js';

export default class Weapon {
    constructor({
                    scene,
                    maxAmmo,
                    dropSprite,
                    handsSprite,
                    isSemi = true,
                    isAuto = false,
                    isMelee = false,
                    reactionTime = 400,
                    cooldown,
                    offset = 0,
                    soundName,
                    deviation = 0,
                    isSilent = false,
                    anims = null,
                    atackRadius = 0,
                    shakeDuration = 100,
                    shakeIntensity = 0.01,
                    isLethal = true
                }) {
        this.scene = scene;
        this.maxAmmo = maxAmmo;
        this.dropSprite = dropSprite;
        this.handsSprite = handsSprite;
        this.isSemi = isSemi;
        this.isAuto = isAuto;
        this.isMelee = isMelee;
        this.reactionTime = reactionTime;
        this.cooldown = cooldown;
        this.anims = anims;
        this.atackRadius = atackRadius;
        this.offset = offset;
        this.isSilent = isSilent;
        this.deviation = deviation;
        this.shakeDuration = shakeDuration;
        this.shakeIntensity = shakeIntensity;
        this.isLethal = isLethal;
        this.ammo = this.maxAmmo;
        this.lastFired = 0;
        this.sound = this.scene.sound.add(soundName, {loop: false, volume: 0.6});
        this.noammo = this.scene.sound.add('no_ammo_sound', {loop: false, volume: 0.7});
    }

    drop(x, y) {
        const droppedWeapon = new WeaponDrop(this.scene, x, y, this);
        this.scene.droppedWeapons.add(droppedWeapon);
        return droppedWeapon;
    }

    isOnCooldown(isPlayer) {
        if (this.lastFired <= 0) return false
        const time = this.scene.time.now;
        const cooldown = (this.isSemi && !isPlayer) ? this.cooldown * 1.5 : this.cooldown;
        return time - this.lastFired < cooldown;
    }


    getDeviation() {
        return Phaser.Math.FloatBetween(-this.deviation, this.deviation);
    }

    getBullet(isPlayer) {
        return isPlayer ? this.scene.playerBullets.get() : this.scene.enemyBullets.get();
    }

    createBullets(shooter, target, isPlayer) {
        const bullet = this.getBullet(isPlayer);
        bullet.fire(shooter, target, this.getDeviation(), this.offset);
    }

    shakeCamera() {
        this.scene.cameras.main.shake(
            this.shakeDuration / this.scene.cameras.main.zoom,
            this.shakeIntensity / this.scene.cameras.main.zoom,
            true
        );
    }

    createMeleeHitbox(shooter, isPlayer) {
        this.scene.time.delayedCall(100, () => {
            if (!shooter.active) return;
            const meleeHitbox = new MeleeHitbox(this.scene, shooter, this.isLethal, this.atackRadius);
            if (isPlayer)
                this.scene.playerHitboxes.add(meleeHitbox);
            else
                this.scene.enemyHitboxes.add(meleeHitbox);
        });
    }

    shoot(shooter, target, isPlayer, playEmptySound = false) {
        if (!this.isMelee && this.ammo <= 0 && isPlayer) {
            if (playEmptySound) this.noammo.play();
            return false;
        }
        if (this.isOnCooldown(isPlayer)) return false;

        this.lastFired = this.scene.time.now;
        if (!this.isMelee && isPlayer) this.ammo -= 1;
        if (isPlayer && !this.isSilent) this.scene.makeNoise(shooter);
        if (this.anims) shooter.anims.play(this.anims[shooter.constructor.name], true);
        this.sound.play();

        if (this.isMelee) this.createMeleeHitbox(shooter, isPlayer);
        else this.createBullets(shooter, target, isPlayer);

        if (isPlayer && !this.isMelee) this.shakeCamera();

        return true;
    }
}
