import Entity from './Entity.js';
import WeaponHands from '../weapons/WeaponHands.js';

export default class Player extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'masunya', 'masunya_dead');
        this.inputKeys = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.inventoryWeapon = new WeaponHands(this.scene);
        this.scene.input.on('pointerdown', pointer => this.checkPointer(pointer));
        this.fatalityAnim = false;
        this.fatalitySound = this.scene.sound.add('fatality_sound', {loop: false, volume: 0.6});
        this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => this.fatality());
        this.scene.physics.add.collider(this, this.scene.walls);
        this.scene.physics.add.collider(this, this.scene.glass);
        this.scene.physics.add.collider(this, this.scene.brokenglass);
        this.scene.physics.add.collider(this, this.scene.furniture);
        this.scene.physics.add.collider(this, this.scene.enemyBullets, (a, bulletHit) => this.bulletCallback(bulletHit));
        this.scene.physics.add.overlap(this, this.scene.enemyHitboxes, (a, meleeHit) => this.meleeCallback(meleeHit));
        this.prev_x = this.x;
        this.prev_y = this.y;
    }

    static preload(scene) {
        scene.load.spritesheet('masunya', 'assets/images/masunya.png', {frameWidth: 140, frameHeight: 140});
        scene.load.spritesheet('masunya_dead', 'assets/images/masunya_dead.png', {frameWidth: 130, frameHeight: 68});
        scene.load.spritesheet('masunya_anims', 'assets/images/masunya_anims.png', {frameWidth: 140, frameHeight: 140});
        scene.load.spritesheet('masunya_fatality', 'assets/images/masunya_fatality.png', {
            frameWidth: 140,
            frameHeight: 140
        });
        scene.load.audio('fatality_sound', 'assets/audio/fatality.mp3');
    }

    static createAnims(scene) {
        scene.anims.create({
            key: 'anim_masunya_fatality',
            frames: scene.anims.generateFrameNumbers('masunya_fatality'),
            duration: 800,
            repeat: 0
        });
        scene.anims.create({
            key: 'anim_masunya_punch1',
            frames: scene.anims.generateFrameNumbers('masunya_anims', {start: 0, end: 2}),
            duration: 200,
            repeat: 0
        });
        scene.anims.create({
            key: 'anim_masunya_punch2',
            frames: scene.anims.generateFrameNumbers('masunya_anims', {start: 3, end: 5}),
            duration: 200,
            repeat: 0
        });
        scene.anims.create({
            key: 'anim_masunya_hammer',
            frames: scene.anims.generateFrameNumbers('masunya_anims', {start: 6, end: 8}),
            duration: 200,
            repeat: 0
        });
        scene.anims.create({
            key: 'anim_masunya_grenade',
            frames: scene.anims.generateFrameNumbers('masunya_anims', {start: 9, end: 11}),
            duration: 200,
            repeat: 0
        });
    }

    fatality() {
        if (this.anims.isPlaying || !this.active) return;
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
        this.anims.play('anim_masunya_fatality', true).once('animationcomplete', () => {
            this.x = oldX;
            this.y = oldY;
            this.fatalityAnim = false;
        });
    }

    pickupWeapon() {
        let nearestWeapon = null;
        this.scene.droppedWeapons.children.each(droppedWeapon => {
            if (droppedWeapon.isCanInteract())
                nearestWeapon = droppedWeapon;
        });
        if (nearestWeapon)
            this.inventoryWeapon = nearestWeapon.pickup();
        else if (this.scene.grenadesBox && this.scene.grenadesBox.isCanInteract())
            this.inventoryWeapon = this.scene.grenadesBox.getGrenade();
    }

    dropWeapon() {
        const vec = this.scene.physics.velocityFromRotation(this.rotation, 600);
        const droppedWeapon = this.inventoryWeapon.drop(this.x, this.y);
        droppedWeapon.setVelocity(vec.x, vec.y);
        droppedWeapon.setDrag(Math.abs(vec.x) * 1.5, Math.abs(vec.y) * 1.5);
        this.inventoryWeapon = new WeaponHands(this.scene);
    }

    checkPointer(pointer) {
        if (!this.active || this.anims.isPlaying) return;
        if (pointer.leftButtonDown())
            this.inventoryWeapon.shoot(this, this.scene.cursor, true, true);
        else if (pointer.rightButtonDown()) {
            if (this.inventoryWeapon instanceof WeaponHands)
                this.pickupWeapon();
            else
                this.dropWeapon();
        }
    }

    moveByInput() {
        const playerVelocity = new Phaser.Math.Vector2();
        if (this.scene.input.keyboard.checkDown(this.inputKeys.left))
            playerVelocity.x = -1;
        else if (this.scene.input.keyboard.checkDown(this.inputKeys.right))
            playerVelocity.x = 1;
        if (this.scene.input.keyboard.checkDown(this.inputKeys.up))
            playerVelocity.y = -1;
        else if (this.scene.input.keyboard.checkDown(this.inputKeys.down))
            playerVelocity.y = 1;
        playerVelocity.normalize();
        playerVelocity.scale(this.runSpeed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);
    }

    cropSpriteUnderWalls() {
        const rotated = this.scene.rotatePoint(210, 0, this.rotation);
        const pointX = this.x + rotated.x;
        const pointY = this.y + rotated.y;
        const dist = this.scene.getWallsMinDist(this, {x: pointX, y: pointY}, true);
        if (dist !== -1) this.setCrop(0, 0, 140 - Math.round(70 - dist / 3) + 10, 140);
        else this.setCrop(0, 0, 140, 140);
    }


    die(frame, attack, isAlive = false) {
        this.scene.deathScreen();
        return super.die(frame, attack, isAlive);
    }

    meleeCallback(meleeHit) {
        if (!super.meleeCallback(meleeHit)) return;
        if (meleeHit.isLethal) {
            const frame = Phaser.Math.Between(3, 4);
            this.die(frame, meleeHit);
        } else
            this.die(0, meleeHit, true);
    }

    update() {
        this.prev_x = this.x;
        this.prev_y = this.y;
        if (this.fatalityAnim) return;
        super.update();

        this.moveByInput();

        this.rotation = Phaser.Math.Angle.BetweenPoints(this, this.scene.cursor);

        const pointer = this.scene.input.activePointer;
        if (pointer.leftButtonDown() && this.inventoryWeapon.isAuto) {
            this.inventoryWeapon.shoot(this, this.scene.cursor, true);
        }

        this.cropSpriteUnderWalls();
    }
}