import MenuPic from '../interface/MenuPic.js';
import MenuButton from '../interface/MenuButton.js';
import Cursor from '../interface/Cursor.js';
import BaseScene from './BaseScene.js';
import config from '../config.js';

export default class UIScene extends BaseScene {
    constructor() {
        super({key: 'ui_scene', active: true});
    }

    preload() {
        super.preload();
        Cursor.preload(this);
        this.load.image('level_cleared', 'assets/images/level_cleared.png');
        this.load.image('death_screen', 'assets/images/death_screen.png');
        this.load.image('button_restart', 'assets/images/button_restart.png');
        this.load.spritesheet('recipe', 'assets/images/recipe.png', {frameWidth: 800, frameHeight: 900});
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
        this.ammoInfoText.depth = config.depth.interface;

        this.grenadesInteractText = this.add.text(
            this.game.config.width / 2,
            this.game.config.height - 60,
            '',
            {
                fontFamily: 'Soup',
                fontSize: 90,
                fontStyle: 'normal',
                color: '#f5f5f5',
                align: 'center'
            }
        );
        this.grenadesInteractText.setScrollFactor(0);
        this.grenadesInteractText.setOrigin(0.5);
        this.grenadesInteractText.depth = config.depth.interface;

        this.gameScene = this.scene.get('game_scene');

        this.gameScene.events.on('ui_show_level_cleared', () => this.showLevelCleared());
        this.gameScene.events.on('ui_show_death_screen', () => this.showDeathScreen());
        this.gameScene.events.on('ui_show_recipe', () => this.showRecipe());
    }

    showDeathScreen() {
        this.cursor = new Cursor(this);
        const menuPic = new MenuPic(this, 360, 'death_screen');
        const menuBut = new MenuButton(this, 850, 'button_restart', () => {
            menuPic.destroy();
            menuBut.destroy();
            this.cursor.destroy();
            this.gameScene.restartScene();
        });
    }

    showRecipe() {
        const recipe = new MenuPic(this, 540, 'recipe');
        this.time.delayedCall(1000, () => {
            const event = this.input.on('pointerdown', () => {
                event.destroy();
                recipe.setFrame(1);
                this.gameScene.paperSound.play();
                const blackScreen = this.add.graphics();
                blackScreen.depth = config.depth.interface;
                blackScreen.fillStyle(0x000000);
                blackScreen.alpha = 0;
                blackScreen.fillRect(
                    this.cameras.main.centerX - this.cameras.main.displayWidth / 2 - 50,
                    this.cameras.main.centerY - this.cameras.main.displayHeight / 2 - 50,
                    this.cameras.main.displayWidth + 100,
                    this.cameras.main.displayHeight + 100
                );
                this.tweens.add({
                    targets: blackScreen,
                    alpha: 1,
                    delay: 2000,
                    duration: 5000,
                    onComplete: () => {
                        this.gameScene.startEnding();
                    }
                });
            });
        });
    }

    showLevelCleared() {
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
            this.grenadesInteractText.setText(config.text.ru.interactGrenadesBox);
        else
            this.grenadesInteractText.setText('');
    }
}