import {WeaponHands} from "./Weapon.js";
import DeadBody from "./DeadBody.js";
import BloodParticle from "./BloodParticle.js";

export default class Entity extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite, bodySprite) {
        super(scene, x, y, sprite, 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(0.5);
        this.setScale(3);
        this.setCircle(19, 51, 51);
        this.depth = 15;
        this.body.pushable = false;
        this.startSprite = sprite;
        this.inventoryWeapon = new WeaponHands(this.scene);
        this.bodySprite = bodySprite;
        this.entitySpeed = 1000;
        this.entitySlowSpeed = 400;
    }

    update() {
        if (!this.anims.isPlaying)
            this.setTexture(this.startSprite, this.inventoryWeapon.handsSprite[this.constructor.name]);
    }

    bulletCallback(bulletHit) {
        bulletHit.disableBody(true, true);
        if (!this.active) return;
        const frame = Phaser.Math.Between(1, 2);
        this.die(frame, bulletHit);
    }

    meleeCallback(meleeHit) {
        if (!meleeHit.checkAngle(this)) return false;
        if (!this.active) return false;
        meleeHit.sound.play();
        meleeHit.destroy();
        return true;
    }

    die(frame, attack, isAlive = false) {
        const body = new DeadBody(this.scene, this.x, this.y, this.bodySprite, frame, isAlive)
        this.scene.deadBodies.add(body);
        body.move(attack);
        this.inventoryWeapon.drop(this.x, this.y);
        this.inventoryWeapon = new WeaponHands(this.scene);
        this.disableBody(true, true);
        if (!isAlive) new BloodParticle(this.scene, this.x, this.y);
        return body;
    }
}