import Reticle from '../interface/Reticle.js';
import Player from '../entities/Player.js';
import Chaos from '../entities/Chaos.js';
import Enemy from '../entities/Enemy.js';
import Bullet from '../projectiles/Bullet.js';
import Grenade from '../projectiles/Grenade.js';
import MeleeHitbox from '../projectiles/MeleeHitbox.js';
import DeadBody from '../entities/DeadBody.js';
import Door from '../interactable/Door.js';
import EndArrow from '../interactable/EndArrow.js';
import BaseScene from './BaseScene.js';
import PointerArrow from '../interface/PointerArrow.js';
import TableInteractable from '../interactable/TableInteractable.js';
import WeaponDrop from '../weapons/WeaponDrop.js';
import WeaponHands from '../weapons/WeaponHands.js';
import WeaponHammer from '../weapons/WeaponHammer.js';
import WeaponPistol from '../weapons/WeaponPistol.js';
import WeaponGrenade from '../weapons/WeaponGrenade.js';
import WeaponRifle from '../weapons/WeaponRifle.js';
import WeaponShotgun from '../weapons/WeaponShotgun.js';

export default class GameScene extends BaseScene {
    constructor() {
        super({key: 'game_scene'})
    }

    preload() {
        super.preload();
        this.load.spritesheet('necoarc', 'assets/images/necoarc.png', {frameWidth: 140, frameHeight: 140});
        this.load.spritesheet('necoarc_dead', 'assets/images/necoarc_dead.png', {frameWidth: 128, frameHeight: 58});
        this.load.spritesheet('necoarc_anims', 'assets/images/necoarc_anims.png', {frameWidth: 140, frameHeight: 140});
        this.load.spritesheet('masunya', 'assets/images/masunya.png', {frameWidth: 140, frameHeight: 140});
        this.load.spritesheet('masunya_dead', 'assets/images/masunya_dead.png', {frameWidth: 130, frameHeight: 68});
        this.load.spritesheet('masunya_anims', 'assets/images/masunya_anims.png', {frameWidth: 140, frameHeight: 140});
        this.load.spritesheet('masunya_fatality', 'assets/images/masunya_fatality.png', {
            frameWidth: 140,
            frameHeight: 140
        });
        this.load.spritesheet('body_fatality', 'assets/images/body_fatality.png', {frameWidth: 128, frameHeight: 58});
        this.load.spritesheet('explosion', 'assets/images/explosion.png', {frameWidth: 70, frameHeight: 70});
        this.load.spritesheet('blood_particle', 'assets/images/blood_particle.png', {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('weapons', 'assets/images/weapons.png', {frameWidth: 70, frameHeight: 70});
        this.load.spritesheet('door_vertical', 'assets/images/door_vertical.png', {frameWidth: 16, frameHeight: 64});
        this.load.spritesheet('door_horizontal', 'assets/images/door_horizontal.png', {
            frameWidth: 64,
            frameHeight: 16
        });
        this.load.image('bullet', 'assets/images/bullet.png');
        this.load.image('crosshair', 'assets/images/crosshair.png');
        //this.load.image('tileset', 'assets/images/extruded.png');
        this.load.image('tileset', 'assets/images/tileset.png');
        this.load.image('arrow', 'assets/images/arrow.png');
        this.load.image('pointer_arrow', 'assets/images/pointer_arrow.png');
        this.load.image('table_interactable', 'assets/images/table_interactable.png');
        this.load.audio('death_sound', 'assets/audio/death.mp3');
        this.load.audio('main_ost', 'assets/audio/main_ost.mp3');
        this.load.audio('peaceful_ost', 'assets/audio/peaceful_ost.mp3');
        this.load.audio('no_ammo_sound', 'assets/audio/no_ammo.mp3');
        this.load.audio('pistol_sound', 'assets/audio/pistol.mp3');
        this.load.audio('rifle_sound', 'assets/audio/rifle.mp3');
        this.load.audio('shotgun_sound', 'assets/audio/shotgun.mp3');
        this.load.audio('explosion_sound', 'assets/audio/explosion.mp3');
        this.load.audio('swing_sound', 'assets/audio/swing.mp3');
        this.load.audio('punch_sound', 'assets/audio/punch.mp3');
        this.load.audio('glass_sound', 'assets/audio/glass.mp3');
        this.load.audio('fatality_sound', 'assets/audio/fatality.mp3');
        this.load.tilemapTiledJSON('tilemap1', 'assets/maps/level1.json');
        this.load.tilemapTiledJSON('tilemap2', 'assets/maps/level2.json');
        this.load.tilemapTiledJSON('tilemap3', 'assets/maps/level3.json');
        this.load.tilemapTiledJSON('tilemap4', 'assets/maps/level4.json');
        this.load.scenePlugin({
            key: 'PhaserNavMeshPlugin',
            url: PhaserNavMeshPlugin,
            sceneKey: 'navMeshPlugin'
        });
    }

    create({level = 4, deathCount = 0}) {
        this.level = level;
        this.deathCount = deathCount;
        this.ending = false;
        this.interactable = null;

        this.cameras.main.zoom = 0.8;
        this.drawBackground();
        this.levelCleared = false;
        this.currentTarget = null;
        this.mainost = this.sound.add('main_ost', {loop: true, volume: 0});
        this.peacefulost = this.sound.add('peaceful_ost', {loop: true, volume: 1});
        this.deathost = this.sound.add('death_sound', {loop: true, volume: 1});
        this.mainost.play();
        this.tweens.add({targets: this.mainost, volume: 1, duration: 1500});
        this.glassSound = this.sound.add('glass_sound', {loop: false, volume: 0.1});

        this.inputKeys = this.input.keyboard.addKeys({
            shft: Phaser.Input.Keyboard.KeyCodes.SHIFT
        });

        const map = this.make.tilemap({key: `tilemap${this.level}`});
        //const tileset = map.addTilesetImage('tileset', 'tileset', 16, 16, 1, 2);
        const tileset = map.addTilesetImage('tileset', 'tileset', 16, 16);
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

        this.brokenglass = map.createBlankLayer('broken_walls', tileset);
        this.brokenglass.setScale(3);
        this.brokenglass.setCollisionByExclusion(-1, true);
        this.brokenglass.depth = 11;

        this.furniture = map.createLayer('furniture', tileset);
        this.furniture.setScale(3);
        this.furniture.setCollisionByExclusion(-1, true);
        this.furniture.depth = 10;

        const pathWalls = map.createBlankLayer('path_walls', tileset);
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

        this.navMesh = this.navMeshPlugin.buildMeshFromTilemap('mesh', map, [pathWalls]);
        this.graphics = this.add.graphics();
        this.graphics.depth = 100;

        this.anims.create({
            key: 'anim_explosion',
            frames: this.anims.generateFrameNumbers('explosion'),
            duration: 200,
            repeat: 0
        });
        this.anims.create({
            key: 'anim_masunya_punch1',
            frames: this.anims.generateFrameNumbers('masunya_anims', {start: 0, end: 2}),
            duration: 200,
            repeat: 0
        });
        this.anims.create({
            key: 'anim_masunya_punch2',
            frames: this.anims.generateFrameNumbers('masunya_anims', {start: 3, end: 5}),
            duration: 200,
            repeat: 0
        });
        this.anims.create({
            key: 'anim_masunya_hammer',
            frames: this.anims.generateFrameNumbers('masunya_anims', {start: 6, end: 8}),
            duration: 200,
            repeat: 0
        });
        this.anims.create({
            key: 'anim_necoarc_punch1',
            frames: this.anims.generateFrameNumbers('necoarc_anims', {start: 0, end: 2}),
            duration: 200,
            repeat: 0
        });
        this.anims.create({
            key: 'anim_necoarc_punch2',
            frames: this.anims.generateFrameNumbers('necoarc_anims', {start: 3, end: 5}),
            duration: 200,
            repeat: 0
        });
        this.anims.create({
            key: 'anim_necoarc_hammer',
            frames: this.anims.generateFrameNumbers('necoarc_anims', {start: 6, end: 8}),
            duration: 200,
            repeat: 0
        });
        this.anims.create({
            key: 'anim_chaos_punch1',
            frames: this.anims.generateFrameNumbers('necoarc_anims', {start: 9, end: 11}),
            duration: 200,
            repeat: 0
        });
        this.anims.create({
            key: 'anim_chaos_punch2',
            frames: this.anims.generateFrameNumbers('necoarc_anims', {start: 12, end: 14}),
            duration: 200,
            repeat: 0
        });
        this.anims.create({
            key: 'anim_masunya_fatality',
            frames: this.anims.generateFrameNumbers('masunya_fatality'),
            duration: 800,
            repeat: 0
        });
        this.anims.create({
            key: 'anim_body_fatality',
            frames: this.anims.generateFrameNumbers('body_fatality', {start: 0, end: 13}),
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
            const weapons = {
                'hands': WeaponHands,
                'hammer': WeaponHammer,
                'pistol': WeaponPistol,
                'rifle': WeaponRifle,
                'shotgun': WeaponShotgun,
                'grenade': WeaponGrenade
            }
            if (weapon === 'chaos')
                this.enemies.add(new Chaos(this, enemy.x, enemy.y, angle, pattern));
            else
                this.enemies.add(new Enemy(this, enemy.x, enemy.y, new weapons[weapon](this), angle, pattern));
        });
        map.getObjectLayer('points').objects.forEach(point => {
            const pointType = point.properties.find(p => p.name === 'pointType').value;
            const center = {x: point.x * 3 + 24, y: point.y * 3 - 24};
            const cornerRight = {x: point.x * 3 + 48, y: point.y * 3};
            if (pointType === 'start') {
                this.player.x = center.x;
                this.player.y = center.y;
            } else if (pointType === 'end') {
                const angle = point.properties.find(p => p.name === 'angle').value;
                this.endArrow = new EndArrow(this, cornerRight.x, cornerRight.y + 24, angle);
            } else if (pointType === 'controls') {
                const text = 'WASD - Движение\nLMB - Стрельба/удар\nRMB - Поднять/выкинуть\nоружие\nSPACE - Добивание\nSHIFT - Осмотреться'
                this.add.text(center.x, center.y, text, {
                    fontFamily: 'Comic Sans MS',
                    fontSize: 45,
                    fontStyle: 'normal',
                    color: '#f5f5f5',
                    align: 'left'
                }).depth = 99;
            } else if (pointType === 'interactable') {
                const interactableType = point.properties.find(p => p.name === 'interactableType').value;
                if (interactableType === 'table')
                    this.interactable = new TableInteractable(this, cornerRight.x, cornerRight.y);
            }
        });
        map.getObjectLayer('doors').objects.forEach(door => {
            const doorOrientation = door.properties.find(p => p.name === 'orientation').value;
            const frame = door.properties.find(p => p.name === 'frame').value;
            const cornerLeft = {x: door.x * 3, y: door.y * 3 - 48};
            this.doors.add(new Door(this, cornerLeft.x, cornerLeft.y, doorOrientation, frame));
        });

        new PointerArrow(this);

        this.cursor = new Reticle(this);
        this.cameras.main.startFollow(this.cursor, true, 0.1, 0.1);

        this.addPixelEffect(true);
        this.addVolumeFade(false);
    }

    addVolumeFade(decrease = true) {
        this.game.sound.volume = decrease ? 1.0 : 0.0;
        this.tweens.add({
            targets: this.game.sound,
            volume: decrease ? 0.0 : 1.0,
            duration: 500
        });
    }

    pause() {
        this.blurEffect = this.cameras.main.postFX.addBlur(2, 2, 2, 1);
        this.scene.pause();
    }

    resume() {
        this.scene.resume();
        this.cameras.main.postFX.remove(this.blurEffect);
    }

    addPixelEffect(decrease = true) {
        const pixelEffect = this.cameras.main.postFX.addPixelate(decrease ? 100 : 0);
        this.tweens.add({
            targets: pixelEffect,
            amount: decrease ? 0 : 100,
            duration: 500,
            onComplete: () => {
                if (decrease) this.cameras.main.postFX.remove(pixelEffect);
            }
        });
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
            this.events.emit('ui_death_screen');
            this.cameras.main.stopFollow();
            this.cursor.destroy();
            this.deathost.play();
        });
    }

    levelEnd() {
        this.tweens.add({targets: this.mainost, volume: 0, duration: 1500, onComplete: () => this.peacefulost.play()});
        this.levelCleared = true;
        this.events.emit('ui_level_cleared');
        this.time.delayedCall(2000, () => {
            if (this.interactable)
                this.activateInteractable();
            else
                this.activateEndArrow();
        });
    }

    activateInteractable() {
        this.interactable.activate();
        this.currentTarget = this.interactable;
    }

    activateEndArrow() {
        this.endArrow.activate();
        this.currentTarget = this.endArrow;
    }

    restartScene(next = false) {
        if (this.ending) return;
        this.ending = true;
        this.addVolumeFade(true);
        this.addPixelEffect(false);
        this.time.delayedCall(520, () => {
            this.game.sound.stopAll();
            this.game.sound.removeAll();
            if (next) {
                if (this.level === 4) this.scene.restart({level: 1, deathCount: 0})
                else this.scene.restart({level: this.level + 1, deathCount: this.deathCount});
            } else
                this.scene.restart({level: this.level, deathCount: this.deathCount + 1});
        });
    }

    nextLevel() {
        this.restartScene(true);
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
        if (this.player.active && !this.levelCleared && this.enemies.countActive() === 0 && this.deadBodies.getMatching('isAlive', true).length === 0)
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
ПУЛИ 16
СТРЕЛКИ 19
СТЕКЛО 20
СТЕНЫ 30
ДВЕРИ 30
ТЕКСТ 99
КУРСОР 100
 */