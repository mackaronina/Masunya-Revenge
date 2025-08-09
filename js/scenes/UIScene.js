import MenuPic from '../interface/MenuPic.js';
import MenuButton from '../interface/MenuButton.js';
import Cursor from '../interface/Cursor.js';
import BaseScene from './BaseScene.js';

export default class UIScene extends BaseScene {
    constructor() {
        super({key: 'ui_cene', active: true});
    }

    preload() {
        super.preload();
        this.load.image('level_cleared', 'assets/images/level_cleared.png');
        this.load.image('death_screen', 'assets/images/death_screen.png');
        this.load.image('button_restart', 'assets/images/button_restart.png');
        this.load.image('cursor', 'assets/images/cursor.png');
        this.load.image('notepad', 'assets/images/notepad.png');
    }

    create() {
        this.cursor = null;
        this.ammoInfoText = this.add.text(
            30,
            this.game.config.height - 120,
            '',
            {
                fontFamily: 'Justice',
                fontSize: 90,
                fontStyle: 'normal',
                color: '#f5f5f5',
                align: 'center'
            }
        );
        this.ammoInfoText.setScrollFactor(0);
        this.ammoInfoText.setPadding(12, 12, 12, 12);
        this.ammoInfoText.depth = 99;
        this.grenadesInteractText = this.add.text(
            this.game.config.width / 2,
            this.game.config.height - 65,
            '',
            {
                fontFamily: 'Comic Sans MS',
                fontSize: 70,
                fontStyle: 'normal',
                color: '#f5f5f5',
                align: 'center'
            }
        );
        this.grenadesInteractText.setScrollFactor(0);
        this.grenadesInteractText.setOrigin(0.5);
        this.grenadesInteractText.depth = 99;
        this.gameScene = this.scene.get('game_scene');
        this.gameScene.events.on('ui_level_cleared', () => this.levelCleared());
        this.gameScene.events.on('ui_death_screen', () => this.deathScreen());
        this.gameScene.events.on('ui_show_notepad', () => this.showNotepad());
    }

    deathScreen() {
        this.cursor = new Cursor(this);
        const menuPic = new MenuPic(this, 360, 'death_screen');
        const menuBut = new MenuButton(this, 850, 'button_restart', () => {
            menuPic.destroy();
            menuBut.destroy();
            this.cursor.destroy();
            this.gameScene.restartScene();
        });
    }

    showNotepad() {
        const notepad = new MenuPic(this, 540, 'notepad');
        const text = `ЗАМЕТКИ
1. Рассмотреть возможность платить
зарплату пилком

2. Узнать кто съел всю питсу в
столовой

3. Перенести сейф с рецептом в 
подвал, так надёжнее`
        const textObj = this.add.text(
            notepad.x - notepad.displayWidth / 2 + 12,
            notepad.y - notepad.displayHeight / 2 + 60,
            text,
            {
                fontFamily: 'Comic Sans MS',
                fontSize: 25,
                fontStyle: 'normal',
                color: '#023A75',
                align: 'left'
            }
        )
        textObj.depth = 100;
        textObj.setOrigin(0, 0);
        this.time.delayedCall(1000, () => {
            this.input.on('pointerdown', () => {
                if (!notepad.active) return
                notepad.destroy();
                textObj.destroy();
                this.gameScene.resume();
            });
        });
    }

    levelCleared() {
        const cleared = new MenuPic(this, 100, 'level_cleared');
        cleared.setScale(0.05);
        this.tweens.add({
            targets: cleared,
            scaleX: 1.1,
            scaleY: 1.1,
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
    }

    update(time, delta) {
        super.update(time, delta);
        if (this.gameScene.player && !this.gameScene.player.inventoryWeapon.isMelee)
            this.ammoInfoText.setText(`${this.gameScene.player.inventoryWeapon.ammo}/${this.gameScene.player.inventoryWeapon.maxAmmo}`);
        else
            this.ammoInfoText.setText('');
        if (this.gameScene.grenadesBox && this.gameScene.grenadesBox.isCanInteract())
            this.grenadesInteractText.setText('ПКМ - Взять гранату');
        else
            this.grenadesInteractText.setText('');
    }
}