import Cursor from '../interface/Cursor.js';
import MenuButton from '../interface/MenuButton.js';
import BaseScene from './BaseScene.js';
import MenuPic from '../interface/MenuPic.js';
import config from '../config.js';
import MenuMasunyaSpin from '../interface/MenuMasunyaSpin.js';

export default class MenuScene extends BaseScene {
    constructor() {
        super({key: 'menu_scene'})
    }

    preload() {
        super.preload();
        Cursor.preload(this);
        MenuMasunyaSpin.preload(this);
        this.load.image('button_start', 'assets/images/button_start.png');
        this.load.image('main_title', 'assets/images/main_title.png');
        this.load.audio('menu_ost', 'assets/audio/menu_ost.mp3');
    }

    create() {
        this.drawBackground();
        this.sound.add('menu_ost', {loop: true, volume: 1}).play();

        MenuMasunyaSpin.createAnims(this);
        
        this.cursor = new Cursor(this);
        new MenuMasunyaSpin(this, -550, true);
        new MenuMasunyaSpin(this, 550, false);
        const mainTitle = new MenuPic(this, 150, 'main_title');
        mainTitle.angle = 2;
        this.tweens.add({
            targets: mainTitle,
            angle: -2,
            duration: 1000,
            repeat: -1,
            yoyo: true
        });
        const button = new MenuButton(this, 650, 'button_start', () => {
            button.disableBody(true, true);
            this.cursor.disableBody(true, true);
            const background = this.add.graphics();
            background.depth = 101;
            background.fillStyle(0x000000);
            background.fillRect(-50, -50, this.game.config.width + 100, this.game.config.height + 100);
            background.setScrollFactor(0);
            const text = config.text.ru.intro;
            const textObj = this.add.text(this.game.config.width / 2, this.game.config.height / 2, '', {
                fontFamily: 'Soup',
                fontSize: 45,
                fontStyle: 'normal',
                color: '#f5f5f5',
                align: 'center'
            })
            textObj.depth = 102;
            textObj.setOrigin(0.5);
            let counter = 1;
            this.time.addEvent({
                delay: 20,
                callback: () => {
                    const textPart = text.substring(0, counter);
                    textObj.setText(textPart);
                    counter++;
                },
                loop: true
            });
            this.time.delayedCall(500, () => {
                this.input.on('pointerdown', () => {
                    this.game.sound.stopAll();
                    this.game.sound.removeAll();
                    this.scene.stop('menu_scene')
                    this.scene.start('game_scene');
                });
            });
        });
    }

}