import WeaponDrop from "./WeaponDrop.js";

export default class Weapon {
    constructor(scene, maxAmmo, dropSprite, handsSprite, isSemi, isAuto, isMelee, kd, offset, soundName, deviation, isSilent = false, isEmpty = false, anims = null, atackRadius = 0) {
        this.scene = scene;
        this.maxAmmo = maxAmmo;
        this.dropSprite = dropSprite;
        this.handsSprite = handsSprite;
        this.isSemi = isSemi;
        this.isAuto = isAuto;
        this.isMelee = isMelee;
        this.kd = kd;
        this.lastFired = 0;
        this.ammo = this.maxAmmo;
        this.isEmpty = isEmpty;
        this.anims = anims;
        this.atackRadius = atackRadius;
        this.offset = offset;
        this.isSilent = isSilent;
        this.deviation = deviation;
        this.sound = this.scene.sound.add(soundName, {loop: false, volume: 0.6});
        this.noammo = this.scene.sound.add('noammosound', {loop: false, volume: 0.7});
    }

    drop(x, y) {
        const dropped = new WeaponDrop(this.scene, x, y, this);
        this.scene.droppedWeapons.add(dropped);
        return dropped;
    }

    checkNearWalls(shooter, offset) {
        const rotated = this.scene.rotatePoint(offset, 0, shooter.rotation);
        const pointX = shooter.x + rotated.x;
        const pointY = shooter.y + rotated.y;
        return this.scene.checkWalls(shooter, {x: pointX, y: pointY}, false);
    }

    checkShoot(shooter, isPlayer, playEmptySound) {
        if (this.ammo <= 0 && !this.isMelee && isPlayer) {
            if (playEmptySound) this.noammo.play();
            return false;
        }

        const time = this.scene.time.now;
        let endKd = this.kd;
        if (this.isSemi && !isPlayer)
            endKd *= 1.5;
        if ((time - this.lastFired) < endKd) return false;

        //if (!isPlayer && Phaser.Math.Distance.BetweenPoints(shooter, this.scene.player) < this.offset)
        //this.offset = Phaser.Math.Distance.BetweenPoints(shooter, this.scene.player) - 20;

        //if (!this.checkNearWalls(shooter, this.offset + 10)) return false;

        this.lastFired = time;
        if (!this.isMelee && isPlayer) this.ammo -= 1;
        if (isPlayer && !this.isSilent) this.scene.makeNoise(shooter);
        if (this.anims) shooter.anims.play(this.anims[shooter.constructor.name], true);
        this.sound.play();
        return true;
    }

    getDeviation() {
        return Phaser.Math.FloatBetween(-this.deviation, this.deviation);
    }

    shoot(shooter, target, isPlayer, playEmptySound = true) {
        if (!this.checkShoot(shooter, isPlayer, playEmptySound)) return;
        let bullet;
        if (isPlayer)
            bullet = this.scene.playerBullets.get();
        else
            bullet = this.scene.enemyBullets.get();
        bullet.fire(shooter, target, this.getDeviation(), this.offset);
        if (isPlayer) this.scene.cameras.main.shake(100 / this.scene.cameras.main.zoom, 0.01 / this.scene.cameras.main.zoom, true);
    }
}
