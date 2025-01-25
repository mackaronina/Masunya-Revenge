import {MeleeHitbox} from './Bullet.js'

export class WeaponDrop extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, weapon) {
        super(scene, x, y, 'weapons', weapon.dropSprite);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.weapon = weapon;
        this.setOrigin(0.5);
        this.setScale(3);
        this.setCircle(20, 15, 15);
        this.depth = 13;
        this.scene.physics.add.collider(this, this.scene.walls);
        this.scene.physics.add.collider(this, this.scene.glass);
        this.postFX.addShine(0.5, 0.3, 5);

    }

    pickup() {
        this.destroy();
        return this.weapon;
    }
}

class Weapon {
    constructor(scene, maxAmmo, dropSprite, handsSprite, isSemi, isAuto, isMelee, kd, offset, soundName, isSilent = false, isEmpty = false, anims = null, atackRadius = 0) {
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

        if (!isPlayer && Phaser.Math.Distance.BetweenPoints(shooter, this.scene.player) < this.offset)
            this.offset = Phaser.Math.Distance.BetweenPoints(shooter, this.scene.player) - 20;

        if (!this.checkNearWalls(shooter, this.offset + 10)) return false;

        this.lastFired = time;
        if (!this.isMelee && isPlayer) this.ammo -= 1;
        if (isPlayer && !this.isSilent) this.scene.makeNoise(shooter);
        if (this.anims) shooter.anims.play(this.anims[shooter.constructor.name], true);
        this.sound.play();
        return true;
    }

    shoot(shooter, target, isPlayer, playEmptySound = true) {
    }
}

export class WeaponKalash extends Weapon {
    constructor(scene) {
        const handsSprite = {
            Player: 5,
            Enemy: 5
        }
        super(scene, 30, 1, handsSprite, false, true, false, 70, 195, 'kalashsound');
    }

    shoot(shooter, target, isPlayer, playEmptySound = true) {
        if (!super.checkShoot(shooter, isPlayer, playEmptySound)) return;
        let bullet;
        if (isPlayer)
            bullet = this.scene.playerBullets.get();
        else
            bullet = this.scene.enemyBullets.get();
        const deviation = Phaser.Math.FloatBetween(-0.05, 0.05);
        bullet.fire(shooter, target, deviation, this.offset);
        if (isPlayer) this.scene.cameras.main.shake(100 / this.scene.cameras.main.zoom, 0.01 / this.scene.cameras.main.zoom, true);
    }
}

export class WeaponMakarov extends Weapon {
    constructor(scene) {
        const handsSprite = {
            Player: 1,
            Enemy: 1
        }
        super(scene, 8, 2, handsSprite, true, false, false, 150, 90, 'makarovsound');
    }

    shoot(shooter, target, isPlayer, playEmptySound = true) {
        if (!super.checkShoot(shooter, isPlayer, playEmptySound)) return;
        let bullet;
        if (isPlayer)
            bullet = this.scene.playerBullets.get();
        else
            bullet = this.scene.enemyBullets.get();
        const deviation = Phaser.Math.FloatBetween(-0.03, 0.03);
        bullet.fire(shooter, target, deviation, this.offset);
        if (isPlayer) this.scene.cameras.main.shake(100 / this.scene.cameras.main.zoom, 0.01 / this.scene.cameras.main.zoom, true);
    }
}

export class WeaponDrobash extends Weapon {
    constructor(scene) {
        const handsSprite = {
            Player: 4,
            Enemy: 4
        }
        super(scene, 4, 3, handsSprite, true, false, false, 400, 140, 'drobashsound');
    }

    shoot(shooter, target, isPlayer, playEmptySound = true) {
        if (!super.checkShoot(shooter, isPlayer, playEmptySound)) return;
        for (let i = 0; i < 6; i++) {
            let bullet;
            if (isPlayer)
                bullet = this.scene.playerBullets.get();
            else
                bullet = this.scene.enemyBullets.get();
            const deviation = Phaser.Math.FloatBetween(-0.13, 0.13);
            bullet.fire(shooter, target, deviation, this.offset);
        }
        if (isPlayer) this.scene.cameras.main.shake(200 / this.scene.cameras.main.zoom, 0.02 / this.scene.cameras.main.zoom, true);
    }
}

export class WeaponGranata extends Weapon {
    constructor(scene) {
        const handsSprite = {
            Player: 3,
            Enemy: 3
        }
        super(scene, 1, 0, handsSprite, true, false, false, 2000, 90, 'zamahsound', true);
    }

    shoot(shooter, target, isPlayer) {
        if (!super.checkShoot(shooter, isPlayer)) return;
        const grenade = this.scene.grenades.get();
        const deviation = Phaser.Math.FloatBetween(-0.03, 0.03);
        grenade.fire(shooter, target, deviation, isPlayer, this.offset);
        if (this.ammo <= 0 && isPlayer) this.scene.player.inventoryWeapon = new WeaponHands(this.scene);
    }
}

export class WeaponKuvalda extends Weapon {
    constructor(scene) {
        const handsSprite = {
            Player: 2,
            Enemy: 2
        }
        const anims = {
            Player: "animMasunyaKuvalda",
            Enemy: "animNecoarcKuvalda"
        }
        super(scene, 0, 4, handsSprite, true, false, true, 300, 0, 'zamahsound', true, false, anims, 62);
    }

    shoot(shooter, target, isPlayer) {
        if (!super.checkShoot(shooter, isPlayer)) return;
        this.scene.time.delayedCall(100, () => {
            if (!shooter.active) return;
            if (isPlayer)
                this.scene.playerHitboxes.add(new MeleeHitbox(this.scene, shooter, true, this.atackRadius));
            else
                this.scene.enemyHitboxes.add(new MeleeHitbox(this.scene, shooter, true, this.atackRadius));
        });
    }
}

export class WeaponHands extends Weapon {
    constructor(scene) {
        const handsSprite = {
            Player: 0,
            Enemy: 0,
            Chaos: 6
        }
        const anims = {
            Player: "animMasunyaPunchFirst",
            Enemy: "animNecoarcPunchFirst",
            Chaos: "animChaosPunchFirst"
        }
        super(scene, 0, -1, handsSprite, true, false, true, 300, 0, 'zamahsound', true, true, anims, 54);
        this.flag = false;
    }

    drop(x, y) {
    }

    shoot(shooter, target, isPlayer) {
        if (!super.checkShoot(shooter, isPlayer)) return;
        this.scene.time.delayedCall(100, () => {
            if (!shooter.active) return;
            if (isPlayer)
                this.scene.playerHitboxes.add(new MeleeHitbox(this.scene, shooter, false, this.atackRadius));
            else
                this.scene.enemyHitboxes.add(new MeleeHitbox(this.scene, shooter, false, this.atackRadius));
        });
        if (this.flag) {
            this.anims = {
                Player: "animMasunyaPunchFirst",
                Enemy: "animNecoarcPunchFirst",
                Chaos: "animChaosPunchFirst"
            }
        } else {
            this.anims = {
                Player: "animMasunyaPunchSecond",
                Enemy: "animNecoarcPunchSecond",
                Chaos: "animChaosPunchSecond"
            }
        }
        this.flag = !this.flag;
    }
}