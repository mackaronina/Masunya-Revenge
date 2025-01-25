import {WeaponHands} from './Weapon.js'
import Entity from "./Entity.js";

export default class Player extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'masunya', 'masunyadead');
        this.inputKeys = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.inventoryWeapon = new WeaponHands(this.scene);
        this.scene.input.on('pointerdown', pointer => this.checkPointer(pointer));
        this.fatalityAnim = false;
        this.fatalitySound = this.scene.sound.add('fatalitysound', {loop: false, volume: 0.6});
        this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => this.fatality());
        this.scene.physics.add.collider(this, this.scene.walls);
        this.scene.physics.add.collider(this, this.scene.glass);
        this.scene.physics.add.collider(this, this.scene.brokenglass);
        this.scene.physics.add.collider(this, this.scene.furniture);
        this.scene.physics.add.collider(this, this.scene.enemyBullets, (a, bulletHit) => this.bulletCallback(bulletHit));
        this.scene.physics.add.overlap(this, this.scene.enemyHitboxes, (a, meleeHit) => this.meleeCallback(meleeHit));
    }

    fatality() {
        let nearestBody = null;
        this.scene.deadBodies.children.each(body => {
            if (!body.isAlive) return;
            const rotated = this.scene.rotatePoint(-116, 0, body.rotation);
            if (Phaser.Math.Distance.BetweenPoints(this, {x: body.x + rotated.x, y: body.y + rotated.y}) < 162)
                nearestBody = body;
        });
        if (!nearestBody) return;
        this.setVelocity(0, 0);
        nearestBody.setVelocity(0, 0);
        this.fatalityAnim = true;
        const oldX = this.x;
        const oldY = this.y;
        const rotated = this.scene.rotatePoint(-116, 0, nearestBody.rotation);
        this.x = nearestBody.x + rotated.x;
        this.y = nearestBody.y + rotated.y;
        this.rotation = Phaser.Math.Angle.Reverse(nearestBody.rotation);
        nearestBody.fatality();
        this.scene.time.delayedCall(533, () => {
            this.fatalitySound.play();
        });
        this.anims.play('animMasunyaFatality', true).once('animationcomplete', () => {
            this.x = oldX;
            this.y = oldY;
            this.fatalityAnim = false;
        });
    }

    checkPointer(pointer) {
        if (!this.active || this.fatalityAnim) return;
        if (pointer.leftButtonDown()) {
            this.inventoryWeapon.shoot(this, this.scene.cursor, true);
        } else if (pointer.rightButtonDown()) {
            if (this.inventoryWeapon.isEmpty) {
                let nearestWeapon = null;
                this.scene.droppedWeapons.children.each(drop => {
                    if (Phaser.Math.Distance.BetweenPoints(this, drop) < 162)
                        nearestWeapon = drop;
                });
                if (nearestWeapon) this.inventoryWeapon = nearestWeapon.pickup();
            } else {
                const vec = this.scene.physics.velocityFromRotation(this.rotation, 600);
                const dropped = this.inventoryWeapon.drop(this.x, this.y);
                dropped.setVelocity(vec.x, vec.y);
                dropped.setDrag(Math.abs(vec.x) * 1.5, Math.abs(vec.y) * 1.5);
                this.inventoryWeapon = new WeaponHands(this.scene);
            }
        }
    }

    update() {
        if (this.fatalityAnim) return;
        super.update();
        let playerVelocity = new Phaser.Math.Vector2();
        if (this.inputKeys.left.isDown) {
            playerVelocity.x = -1;
        } else if (this.inputKeys.right.isDown) {
            playerVelocity.x = 1;
        }
        if (this.inputKeys.up.isDown) {
            playerVelocity.y = -1;
        } else if (this.inputKeys.down.isDown) {
            playerVelocity.y = 1;
        }
        playerVelocity.normalize();
        playerVelocity.scale(this.entitySpeed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);
        this.rotation = Phaser.Math.Angle.BetweenPoints(this, this.scene.cursor);

        const pointer = this.scene.input.activePointer;
        if (pointer.leftButtonDown() && this.inventoryWeapon.isAuto) {
            this.inventoryWeapon.shoot(this, this.scene.cursor, true, false);
        }
        const rotated = this.scene.rotatePoint(210, 0, this.rotation);
        const pointX = this.x + rotated.x;
        const pointY = this.y + rotated.y;
        const dist = this.scene.getWallsMinDist(this, {x: pointX, y: pointY}, true);
        if (dist !== -1) this.setCrop(0, 0, 140 - Math.round(70 - dist / 3) + 10, 140);
        else this.setCrop(0, 0, 140, 140);
    }

    die(frame, attack, isAlive = false) {
        super.die(frame, attack, isAlive);
        this.scene.deathScreen();
    }

    meleeCallback(meleeHit) {
        if (!super.meleeCallback(meleeHit)) return;
        if (meleeHit.isLethal) {
            const frame = Phaser.Math.Between(3, 4);
            this.die(frame, meleeHit);
        } else
            this.die(0, meleeHit, true);
    }
}