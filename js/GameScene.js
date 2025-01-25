import Reticle from './Reticle.js';
import Player from './Player.js';
import Chaos from "./Chaos.js";
import Enemy from "./Enemy.js";
import {Bullet, Grenade, MeleeHitbox} from './Bullet.js';
import {
    WeaponDrobash,
    WeaponDrop,
    WeaponGranata,
    WeaponHands,
    WeaponKalash,
    WeaponKuvalda,
    WeaponMakarov
} from './Weapon.js';
import DeadBody from "./DeadBody.js";
import Door from "./Door.js";
import MenuButton from "./MenuButton.js";
import MenuPic from "./MenuPic.js";
import Cursor from "./Cursor.js";
import EndArrow from "./EndArrow.js";
import BaseScene from "./BaseScene.js";
import PointerArrow from "./PointerArrow.js";

export default class GameScene extends BaseScene {
    constructor() {
        super({key: 'GameScene'})
    }

    preload() {
        super.preload();
        this.load.spritesheet('necoarc', 'assets/images/necoarc.png', {frameWidth: 140, frameHeight: 140});
        this.load.spritesheet('necoarcdead', 'assets/images/necoarcdead.png', {frameWidth: 128, frameHeight: 58});
        this.load.spritesheet('necoarcanims', 'assets/images/necoarcanims.png', {frameWidth: 140, frameHeight: 140});
        this.load.spritesheet('masunya', 'assets/images/masunya.png', {frameWidth: 140, frameHeight: 140});
        this.load.spritesheet('masunyadead', 'assets/images/masunyadead.png', {frameWidth: 130, frameHeight: 68});
        this.load.spritesheet('masunyaanims', 'assets/images/masunyaanims.png', {frameWidth: 140, frameHeight: 140});
        this.load.spritesheet('masunyafatality', 'assets/images/masunyafatality.png', {
            frameWidth: 140,
            frameHeight: 140
        });
        this.load.spritesheet('bodyfatality', 'assets/images/bodyfatality.png', {frameWidth: 128, frameHeight: 58});
        this.load.spritesheet('explosion', 'assets/images/explosion.png', {frameWidth: 70, frameHeight: 70});
        this.load.spritesheet('bloodparticle', 'assets/images/bloodparticle.png', {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('weapons', 'assets/images/weapons.png', {frameWidth: 70, frameHeight: 70});
        this.load.spritesheet('doorvertical', 'assets/images/doorvertical.png', {frameWidth: 16, frameHeight: 64});
        this.load.spritesheet('doorhorizontal', 'assets/images/doorhorizontal.png', {frameWidth: 64, frameHeight: 16});
        this.load.image('bullet', 'assets/images/bullet.png');
        this.load.image('crosshair', 'assets/images/crosshair.png');
        this.load.image('cursor', 'assets/images/cursor.png');
        this.load.image('deathscreen', 'assets/images/deathscreen.png');
        this.load.image('buttonrestart', 'assets/images/buttonrestart.png');
        this.load.image('tileset', 'assets/images/extruded.png');
        this.load.image('levelcleared', 'assets/images/levelcleared.png');
        this.load.image('arrow', 'assets/images/arrow.png');
        this.load.image('pointerarrow', 'assets/images/pointerarrow.png');
        this.load.audio("deathsound", "assets/audio/deathsound.mp3");
        this.load.audio("mainost", "assets/audio/mainost.mp3");
        this.load.audio("peacefulost", "assets/audio/peacefulost.mp3");
        this.load.audio("noammosound", "assets/audio/noammo.mp3");
        this.load.audio("makarovsound", "assets/audio/makarov.mp3");
        this.load.audio("kalashsound", "assets/audio/kalash.mp3");
        this.load.audio("drobashsound", "assets/audio/drobash.mp3");
        this.load.audio("explosionsound", "assets/audio/explosion.mp3");
        this.load.audio("zamahsound", "assets/audio/zamah.mp3");
        this.load.audio("punchsound", "assets/audio/punch.mp3");
        this.load.audio("glasssound", "assets/audio/glass.mp3");
        this.load.audio("fatalitysound", "assets/audio/fatality.mp3");
        this.load.tilemapTiledJSON('tilemap1', 'assets/maps/level1.json');
        this.load.tilemapTiledJSON('tilemap2', 'assets/maps/level2.json');
        this.load.scenePlugin({
            key: 'PhaserNavMeshPlugin',
            url: PhaserNavMeshPlugin,
            sceneKey: 'navMeshPlugin'
        });
    }

    create(data) {
        this.level = data.level || 1;
        this.deathCount = data.deathCount || 0;

        this.cameras.main.zoom = 0.8;
        super.create();
        this.levelCleared = false;
        this.currentTarget = null;
        this.mainost = this.sound.add("mainost", {loop: true, volume: 0});
        this.peacefulost = this.sound.add("peacefulost", {loop: true, volume: 1});
        this.deathost = this.sound.add("deathsound", {loop: true, volume: 1});
        this.mainost.play();
        this.tweens.add({targets: this.mainost, volume: 1, duration: 1500});
        this.glassSound = this.sound.add("glasssound", {loop: false, volume: 0.1});

        this.inputKeys = this.input.keyboard.addKeys({
            shft: Phaser.Input.Keyboard.KeyCodes.SHIFT
        });

        const map = this.make.tilemap({key: `tilemap${this.level}`});
        const tileset = map.addTilesetImage('tileset', 'tileset', 16, 16, 1, 2);
        const floor = map.createLayer('floor', tileset);
        floor.setScale(3);
        floor.depth = 1;
        this.walls = map.createLayer('walls', tileset);
        this.walls.setScale(3);
        this.walls.setCollisionByExclusion(-1, true);
        this.walls.depth = 30;

        this.glass = map.createLayer('glass', tileset);
        this.glass.setScale(3);
        this.glass.setCollisionByExclusion(-1, true);
        this.glass.depth = 20;

        this.brokenglass = map.createBlankLayer('brokenwalls', tileset);
        this.brokenglass.setScale(3);
        this.brokenglass.setCollisionByExclusion(-1, true);
        this.brokenglass.depth = 11;

        this.furniture = map.createLayer('furniture', tileset);
        this.furniture.setScale(3);
        this.furniture.setCollisionByExclusion(-1, true);
        this.furniture.depth = 10;

        const pathWalls = map.createBlankLayer('pathwalls', tileset);
        for (let y = 1; y < map.height - 1; y++) {
            for (let x = 1; x < map.width - 1; x++) {
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (this.walls.getTileAt(x + i, y + j) ||
                            this.glass.getTileAt(x + i, y + j) ||
                            this.furniture.getTileAt(x + i, y + j))
                            pathWalls.putTileAt(99, x, y);
                    }
                }
            }
        }
        pathWalls.visible = false;
        pathWalls.depth = 100;
        pathWalls.setScale(3);
        pathWalls.setCollisionByExclusion(-1, true);

        this.navMesh = this.navMeshPlugin.buildMeshFromTilemap("mesh", map, [pathWalls]);
        this.graphics = this.add.graphics();
        this.graphics.depth = 100;

        this.anims.create({
            key: "animExplosion",
            frames: this.anims.generateFrameNumbers("explosion"),
            duration: 200,
            repeat: 0
        });
        this.anims.create({
            key: "animMasunyaPunchFirst",
            frames: this.anims.generateFrameNumbers("masunyaanims", {start: 0, end: 2}),
            duration: 200,
            repeat: 0
        });
        this.anims.create({
            key: "animMasunyaPunchSecond",
            frames: this.anims.generateFrameNumbers("masunyaanims", {start: 3, end: 5}),
            duration: 200,
            repeat: 0
        });
        this.anims.create({
            key: "animMasunyaKuvalda",
            frames: this.anims.generateFrameNumbers("masunyaanims", {start: 6, end: 8}),
            duration: 200,
            repeat: 0
        });
        this.anims.create({
            key: "animNecoarcPunchFirst",
            frames: this.anims.generateFrameNumbers("necoarcanims", {start: 0, end: 2}),
            duration: 200,
            repeat: 0
        });
        this.anims.create({
            key: "animNecoarcPunchSecond",
            frames: this.anims.generateFrameNumbers("necoarcanims", {start: 3, end: 5}),
            duration: 200,
            repeat: 0
        });
        this.anims.create({
            key: "animNecoarcKuvalda",
            frames: this.anims.generateFrameNumbers("necoarcanims", {start: 6, end: 8}),
            duration: 200,
            repeat: 0
        });
        this.anims.create({
            key: "animChaosPunchFirst",
            frames: this.anims.generateFrameNumbers("necoarcanims", {start: 9, end: 11}),
            duration: 200,
            repeat: 0
        });
        this.anims.create({
            key: "animChaosPunchSecond",
            frames: this.anims.generateFrameNumbers("necoarcanims", {start: 12, end: 14}),
            duration: 200,
            repeat: 0
        });
        this.anims.create({
            key: "animMasunyaFatality",
            frames: this.anims.generateFrameNumbers("masunyafatality"),
            duration: 800,
            repeat: 0
        });
        this.anims.create({
            key: "animBodyFatality",
            frames: this.anims.generateFrameNumbers("bodyfatality", {start: 0, end: 13}),
            duration: 933,
            repeat: 0
        });

        this.enemyBullets = this.physics.add.group({classType: Bullet, immovable: true});
        this.playerBullets = this.physics.add.group({classType: Bullet, immovable: true});
        this.grenades = this.physics.add.group({classType: Grenade});
        this.enemies = this.physics.add.group({classType: Enemy, immovable: true});
        this.droppedWeapons = this.physics.add.group({classType: WeaponDrop});
        this.enemyHitboxes = this.physics.add.group({classType: MeleeHitbox});
        this.playerHitboxes = this.physics.add.group({classType: MeleeHitbox});
        this.deadBodies = this.physics.add.group({classType: DeadBody});
        this.doors = this.physics.add.group({classType: Door, immovable: true});
        this.player = new Player(this, 0, 0);

        map.getObjectLayer('enemies').objects.forEach(enemy => {
            const weapon = enemy.properties.find(p => p.name === 'weapon').value;
            const angle = enemy.properties.find(p => p.name === 'angle').value;
            const pattern = enemy.properties.find(p => p.name === 'pattern').value;
            enemy.x = enemy.x * 3 + 24;
            enemy.y = enemy.y * 3 - 24;
            if (weapon === "hands")
                this.enemies.add(new Enemy(this, enemy.x, enemy.y, new WeaponHands(this), angle, pattern));
            else if (weapon === "kuvalda")
                this.enemies.add(new Enemy(this, enemy.x, enemy.y, new WeaponKuvalda(this), angle, pattern));
            else if (weapon === "makarov")
                this.enemies.add(new Enemy(this, enemy.x, enemy.y, new WeaponMakarov(this), angle, pattern));
            else if (weapon === "kalash")
                this.enemies.add(new Enemy(this, enemy.x, enemy.y, new WeaponKalash(this), angle, pattern));
            else if (weapon === "drobash")
                this.enemies.add(new Enemy(this, enemy.x, enemy.y, new WeaponDrobash(this), angle, pattern));
            else if (weapon === "granata")
                this.enemies.add(new Enemy(this, enemy.x, enemy.y, new WeaponGranata(this), angle, pattern));
            else if (weapon === "chaos")
                this.enemies.add(new Chaos(this, enemy.x, enemy.y, angle, pattern));
        });
        map.getObjectLayer('points').objects.forEach(point => {
            const pointType = point.properties.find(p => p.name === 'pointType').value;
            point.x = point.x * 3 + 24;
            point.y = point.y * 3 - 24;
            if (pointType === "start") {
                this.player.x = point.x;
                this.player.y = point.y;
            } else if (pointType === "end") {
                const angle = point.properties.find(p => p.name === 'angle').value;
                this.endArrow = new EndArrow(this, point.x + 24, point.y + 24, angle);
            } else if (pointType === "controls") {
                const text = "WASD - Движение\nLMB - Стрельба/удар\nRMB - Поднять/выкинуть\nоружие\nSPACE - Добивание\nSHIFT - Осмотреться"
                this.add.text(point.x, point.y, text, {
                    fontFamily: "Comic Sans MS",
                    fontSize: 45,
                    fontStyle: 'normal',
                    color: "#f5f5f5",
                    align: 'left'
                }).depth = 99;
            }
        });
        map.getObjectLayer('doors').objects.forEach(door => {
            const doorOrientation = door.properties.find(p => p.name === 'orientation').value;
            const frame = door.properties.find(p => p.name === 'frame').value;
            this.doors.add(new Door(this, door.x * 3, door.y * 3 - 48, doorOrientation, frame));
        });

        const newY = this.cameras.main.centerY + (this.game.config.height / 2 - 120) / this.cameras.main.zoom;
        const newX = this.cameras.main.centerX + (40 - this.game.config.width / 2) / this.cameras.main.zoom;
        this.ammoInfo = this.add.text(
            newX,
            newY,
            "",
            {
                fontFamily: "Justice",
                fontSize: 90 / this.cameras.main.zoom,
                fontStyle: 'normal',
                color: "#f5f5f5",
                align: 'center'
            }
        );
        this.ammoInfo.setScrollFactor(0);
        this.ammoInfo.setPadding(12, 12, 12, 12);
        this.ammoInfo.depth = 99;

        new PointerArrow(this);

        this.cursor = new Reticle(this);
        this.cameras.main.startFollow(this.cursor, true, 0.1, 0.1);

    }

    destroyGlass(glassTile) {
        const newTiles = {
            100: 101,
            132: 133,
            164: 165,
            129: 161,
            130: 162,
            131: 163
        }
        if (!newTiles[glassTile.index]) return;
        const newIndex = newTiles[glassTile.index];
        this.glass.putTileAt(-1, glassTile.x, glassTile.y);
        this.glass.setCollisionByExclusion(-1, true);
        this.brokenglass.putTileAt(newIndex, glassTile.x, glassTile.y);
        this.brokenglass.setCollisionByExclusion(-1, true);
        this.glassSound.play();
    }

    checkWalls(start, end, checkGlass = false) {
        const dist = this.getWallsMinDist(start, end, checkGlass);
        return (dist === -1);
    }

    getWallsMinDist(start, end, checkGlass = false) {
        let ret = 999999;
        const points = [];
        const line = new Phaser.Geom.Line(start.x, start.y, end.x, end.y);
        this.walls.forEachTile(tile => {
            if (!tile.canCollide) return;
            const rect = new Phaser.Geom.Rectangle(tile.x * 48, tile.y * 48, 48, 48);
            Phaser.Geom.Intersects.GetLineToRectangle(line, rect, points);
        });
        this.doors.children.each(door => {
            if (!door.visible) return;
            const rect = new Phaser.Geom.Rectangle(door.x, door.y, door.displayWidth, door.displayHeight);
            Phaser.Geom.Intersects.GetLineToRectangle(line, rect, points);
        });
        if (checkGlass) {
            this.glass.forEachTile(tile => {
                if (!tile.canCollide) return;
                const rect = new Phaser.Geom.Rectangle(tile.x * 48, tile.y * 48, 48, 48);
                Phaser.Geom.Intersects.GetLineToRectangle(line, rect, points);
            });
        }
        points.forEach(point => {
            const dist = Phaser.Math.Distance.BetweenPoints(start, point);
            if (dist < ret) ret = dist;
        });
        if (ret === 999999) return -1;
        return ret;
    }

    makeNoise(point) {
        this.enemies.children.each(enemy => {
            if (!enemy.active) return;
            if (Phaser.Math.Distance.BetweenPoints(point, enemy) < 1600)
                enemy.agro = true;
        })
    }

    deathScreen() {
        this.tweens.add({targets: this.mainost, volume: 0, duration: 2000});
        this.tweens.add({targets: this.peacefulost, volume: 0, duration: 2000});
        this.time.delayedCall(2000, () => {
            this.cameras.main.stopFollow();
            this.cursor.destroy();
            this.cursor = new Cursor(this);
            new MenuPic(this, 360, "deathscreen");
            new MenuButton(this, 850, "buttonrestart", () => {
                this.game.sound.stopAll();
                this.game.sound.removeAll();
                this.scene.restart({level: this.level, deathCount: this.deathCount + 1});
            });
            this.deathost.play();
        });
    }

    levelEnd() {
        this.tweens.add({targets: this.mainost, volume: 0, duration: 1500, onComplete: () => this.peacefulost.play()});
        this.levelCleared = true;
        const cleared = new MenuPic(this, 120, "levelcleared");
        cleared.setScale(0.05 / this.cameras.main.zoom);
        this.tweens.add({
            targets: cleared,
            scaleX: 1 / this.cameras.main.zoom,
            scaleY: 1 / this.cameras.main.zoom,
            duration: 1500,
            onComplete: () => {
                this.tweens.add({
                    delay: 1500,
                    targets: cleared,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => {
                        cleared.destroy();
                    }
                });
            }
        });
        this.time.delayedCall(2000, () => {
            this.endArrow.activate();
            this.currentTarget = this.endArrow;
        });
    }

    nextLevel() {
        this.game.sound.stopAll();
        this.game.sound.removeAll();
        console.log(this.deathCount);
        if (this.level === 2) this.scene.restart({level: 1, deathCount: 0})
        else this.scene.restart({level: this.level + 1, deathCount: this.deathCount});
    }

    angleDiff(a, b) {
        a = Phaser.Math.Angle.Normalize(a);
        b = Phaser.Math.Angle.Normalize(b);
        const c = Math.max(a, b) - Math.min(a, b);
        const d = 2 * Math.PI - Math.max(a, b) + Math.min(a, b);
        return Math.min(c, d);
    }

    rotatePoint(vecX, vecY, angle) {
        const rotatedX = vecX * Math.cos(angle) - vecY * Math.sin(angle);
        const rotatedY = vecX * Math.sin(angle) + vecY * Math.cos(angle);
        return {x: rotatedX, y: rotatedY};
    }

    update(time, delta) {
        super.update(time, delta);
        const viewWidth = 3720 / this.cameras.main.zoom;
        const viewHeight = 2040 / this.cameras.main.zoom;
        if (this.inputKeys.shft.isDown) {
            this.cameras.main.setBounds(this.player.x - viewWidth / 2, this.player.y - viewHeight / 2, viewWidth, viewHeight);
        } else {
            this.cameras.main.setBounds(
                this.player.x - this.cameras.main.displayWidth / 2 - 40 / this.cameras.main.zoom,
                this.player.y - this.cameras.main.displayHeight / 2 - 40 / this.cameras.main.zoom,
                this.cameras.main.displayWidth + 80 / this.cameras.main.zoom,
                this.cameras.main.displayHeight + 80 / this.cameras.main.zoom
            );
        }
        if (this.player.inventoryWeapon && !this.player.inventoryWeapon.isMelee)
            this.ammoInfo.setText(`${this.player.inventoryWeapon.ammo}/${this.player.inventoryWeapon.maxAmmo}`);
        else
            this.ammoInfo.setText("");
        if (this.player.active && !this.levelCleared && this.enemies.countActive() === 0 && this.deadBodies.getMatching("isAlive", true).length === 0)
            this.levelEnd();
    }
}
/*
ГЛУБИНЫ
ФОН -1
ПОЛ 0
КРОВЬ 2
МЕБЕЛЬ 10
СЛОМАННОЕ СТЕКЛО 11
ТЕЛО 12
ОРУЖИЕ 13
ВРАГИ/ИГРОК 15
СТРЕЛКИ 19
СТЕКЛО 20
ПУЛИ 25
СТЕНЫ 30
ДВЕРИ 30
ТЕКСТ 99
КУРСОР 100
 */