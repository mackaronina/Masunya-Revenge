import BaseScene from './BaseScene.js';
import MenuPic from '../interface/MenuPic.js';
import config from '../config.js';

export default class EndingScene extends BaseScene {
    constructor() {
        super({key: 'ending_scene'})
    }

    preload() {
        super.preload();
        this.load.image('newspaper', 'assets/images/newspaper.png');
        this.load.audio('ending_ost', 'assets/audio/ending_ost.mp3');
    }

    create({deathCount = 0}) {
        this.drawBackground(true);
        this.sound.add('ending_ost', {loop: true, volume: 1}).play();

        const newspaper = new MenuPic(this, 600, 'newspaper');

        const newspaperText = this.add.text(
            newspaper.x - newspaper.width / 2 + 150,
            newspaper.y - newspaper.height / 2 + 214,
            config.text.ru.ending,
            {
                fontFamily: 'Comic Sans MS',
                fontSize: 20,
                fontStyle: 'normal',
                color: '#353535',
                align: 'left'
            })
        newspaperText.depth = config.depth.interface;
        newspaperText.setScrollFactor(0);

        const deathCountText = this.add.text(
            this.game.config.width / 2,
            110,
            `${config.text.ru.deathCount} 0`,
            {
                fontFamily: 'Soup',
                fontSize: 100,
                fontStyle: 'normal',
                color: '#f5f5f5',
                align: 'center'
            }
        );
        deathCountText.depth = config.depth.interface;
        deathCountText.setScrollFactor(0);
        deathCountText.setOrigin(0.5);

        deathCountText.displayedDeathCount = 0;
        this.tweens.add({
            targets: deathCountText,
            displayedDeathCount: deathCount,
            duration: 2000,
            onUpdate: () => {
                deathCountText.setText(`${config.text.ru.deathCount} ${Math.round(deathCountText.displayedDeathCount)}`);
            }
        });

    }
}