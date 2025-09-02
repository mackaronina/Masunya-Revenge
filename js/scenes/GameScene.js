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
import GrenadesBox from '../interactable/GrenadesBox.js';
import BloodParticle from '../entities/BloodParticle.js';
import Weapon from '../weapons/Weapon.js';
import config from '../config.js';

export default class GameScene extends BaseScene {
    constructor() {
        super({key: 'game_scene'})
    }

    preload() {
        super.preload();
        BloodParticle.preload(this);
        DeadBody.preload(this);
        Enemy.preload(this);
        Player.preload(this);
        Door.preload(this);
        EndArrow.preload(this);
        GrenadesBox.preload(this);
        TableInteractable.preload(this);
        PointerArrow.preload(this);
        Reticle.preload(this);
        Bullet.preload(this);
        Grenade.preload(this);
        MeleeHitbox.preload(this);
        Weapon.preload(this);
        WeaponDrop.preload(this);
        WeaponGrenade.preload(this);
        WeaponHammer.preload(this);
        WeaponHands.preload(this);
        WeaponPistol.preload(this);
        WeaponRifle.preload(this);
        WeaponShotgun.preload(this);
        this.load.image('tileset', 'assets/images/tileset.png');
        this.load.image('extruded_tileset', 'assets/images/extruded_tileset.png');
        this.load.audio('death_ost', 'assets/audio/death_ost.mp3');
        this.load.audio('main_ost', 'assets/audio/main_ost.mp3');
        this.load.audio('peaceful_ost', 'assets/audio/peaceful_ost.mp3');
        this.load.audio('glass_sound', 'assets/audio/glass.mp3');
        this.load.audio('paper_sound', 'assets/audio/paper.mp3');
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

    create({level = config.startLevel, deathCount = 0}) {
        this.level = level;
        this.deathCount = deathCount;
        this.ending = false;
        this.interactable = null;
        this.grenadesBox = null;
        this.levelCleared = false;
        this.currentTarget = null;

        this.cameras.main.zoom = 0.8;

        this.drawBackground();

        this.mainost = this.sound.add('main_ost', {loop: true, volume: 1});
        this.peacefulost = this.sound.add('peaceful_ost', {loop: true, volume: 1});
        this.deathost = this.sound.add('death_ost', {loop: true, volume: 1});
        this.glassSound = this.sound.add('glass_sound', {loop: false, volume: 0.1});
        this.paperSound = this.sound.add('paper_sound', {loop: false, volume: 2});

        this.mainost.play();

        this.inputKeys = this.input.keyboard.addKeys({
            shft: Phaser.Input.Keyboard.KeyCodes.SHIFT
        });

        const map = this.make.tilemap({key: `tilemap${this.level}`});
        //const tileset = map.addTilesetImage('tileset', 'tileset', 16, 16);
        const tileset = map.addTilesetImage('tileset', 'extruded_tileset', 16, 16, 1, 2);

        const floor = map.createLayer('floor', tileset);
        floor.setScale(3);
        floor.depth = config.depth.floor;

        this.walls = map.createLayer('walls', tileset);
        this.walls.setScale(3);
        this.walls.setCollisionByExclusion(-1, true);
        this.walls.depth = config.depth.walls;

        this.glass = map.createLayer('glass', tileset);
        this.glass.setScale(3);
        this.glass.setCollisionByExclusion(-1, true);
        this.glass.depth = config.depth.glass;

        this.brokenglass = map.createBlankLayer('broken_walls', tileset);
        this.brokenglass.setScale(3);
        this.brokenglass.setCollisionByExclusion(-1, true);
        this.brokenglass.depth = config.depth.brokenGlass;

        this.furniture = map.createLayer('furniture', tileset);
        this.furniture.setScale(3);
        this.furniture.setCollisionByExclusion(-1, true);
        this.furniture.depth = config.depth.furniture;

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
        pathWalls.depth = config.depth.interface;
        pathWalls.setScale(3);
        pathWalls.setCollisionByExclusion(-1, true);

        this.navMesh = this.navMeshPlugin.buildMeshFromTilemap('mesh', map, [pathWalls]);
        this.graphics = this.add.graphics();
        this.graphics.depth = config.depth.interface;

        Player.createAnims(this);
        DeadBody.createAnims(this);
        Enemy.createAnims(this);
        Chaos.createAnims(this);
        Grenade.createAnims(this);

        this.enemyBullets = this.physics.add.group({classType: Bullet, immovable: true, quantity: 100, max: 100});
        this.playerBullets = this.physics.add.group({classType: Bullet, immovable: true, quantity: 100, max: 100});
        this.grenades = this.physics.add.group({classType: Grenade, quantity: 10, max: 10});
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
                hands: WeaponHands,
                hammer: WeaponHammer,
                pistol: WeaponPistol,
                rifle: WeaponRifle,
                shotgun: WeaponShotgun,
                grenade: WeaponGrenade
            };
            if (weapon === 'chaos')
                this.enemies.add(new Chaos(this, enemy.x, enemy.y, angle, pattern));
            else
                this.enemies.add(new Enemy(this, enemy.x, enemy.y, new weapons[weapon](this), angle, pattern));
        });

        map.getObjectLayer('points').objects.forEach(point => {
            const pointType = point.properties.find(p => p.name === 'pointType').value;
            const coords = {
                center: {x: point.x * 3 + 24, y: point.y * 3 - 24},
                rightBottom: {x: point.x * 3 + 48, y: point.y * 3},
                rightMiddle: {x: point.x * 3 + 48, y: point.y * 3 - 24},
            }
            if (pointType === 'start') {
                this.player.x = coords.center.x;
                this.player.y = coords.center.y;
            } else if (pointType === 'end') {
                const angle = point.properties.find(p => p.name === 'angle').value;
                this.endArrow = new EndArrow(this, coords.rightBottom.x, coords.rightBottom.y + 24, angle);
            } else if (pointType === 'controls') {
                const text = config.text.ru.controls;
                this.add.text(coords.center.x, coords.center.y, text, {
                    fontFamily: 'Soup',
                    fontSize: 45,
                    fontStyle: 'normal',
                    color: '#f5f5f5',
                    align: 'left'
                }).depth = 99;
            } else if (pointType === 'interactable') {
                this.interactable = new TableInteractable(this, coords.rightMiddle.x, coords.rightMiddle.y);
            } else if (pointType === 'grenades_box')
                this.grenadesBox = new GrenadesBox(this, coords.rightBottom.x, coords.rightBottom.y);
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
        this.addAllSoundFade({decrease: false});

        this.events.emit('ui_show_current_level');
    }

    showRecipe() {
        this.pause();
        this.events.emit('ui_show_recipe');
        this.addSoundFade({sounds: [this.mainost, this.peacefulost]});
    }

    startEnding() {
        this.removeSound();
        this.scene.stop('game_scene');
        this.scene.stop('ui_scene');
        this.scene.start('ending_scene', {deathCount: this.deathCount});
    }

    addSoundFade({sounds, decrease = true, onComplete = null, duration = 1500}) {
        this.tweens.add({
            targets: sounds,
            volume: decrease ? 0.0 : 1.0,
            duration: duration,
            onComplete: onComplete
        });
    }

    addAllSoundFade({decrease = true, onComplete = null, duration = 500}) {
        this.game.sound.volume = decrease ? 1.0 : 0.0;
        this.tweens.add({
            targets: this.game.sound,
            volume: decrease ? 0.0 : 1.0,
            duration: duration,
            onComplete: onComplete
        });
    }

    pause() {
        this.cameras.main.stopFollow();
        this.cursor.destroy();
        this.player.active = false;
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
        if (!config.brokenGlassTiles[glassTile.index]) return;
        const newIndex = config.brokenGlassTiles[glassTile.index];
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
            if (Phaser.Math.Distance.BetweenPoints(point, enemy) < 1500)
                enemy.agro = true;
        })
    }

    deathScreen() {
        this.addSoundFade({sounds: [this.mainost, this.peacefulost]});
        this.time.delayedCall(1500, () => {
            this.pause();
            this.events.emit('ui_show_death_screen');
            this.deathost.play();
        });
    }

    levelEnd() {
        this.addSoundFade({
            sounds: [this.mainost],
            onComplete: () => {
                this.peacefulost.play()
            }
        });
        this.levelCleared = true;
        this.events.emit('ui_show_level_cleared');
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
        this.addAllSoundFade({decrease: true});
        this.addPixelEffect(false);
        this.time.delayedCall(520, () => {
            this.removeSound();
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