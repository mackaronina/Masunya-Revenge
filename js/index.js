import GameScene from './scenes/GameScene.js'
import MenuScene from './scenes/MenuScene.js';
import UIScene from './scenes/UIScene.js';
import config from './config.js';
import EndingScene from './scenes/EndingScene.js';

const ratio = Math.max(window.screen.width / window.screen.height, window.screen.height / window.screen.width);
const DEFAULT_HEIGHT = 1080;
const DEFAULT_WIDTH = Math.round(ratio * DEFAULT_HEIGHT);

const phaserConfig = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'thegame',
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            fps: 300,
            debug: config.debug,
            debugBodyColor: 0x000000
        }
    },
    pixelArt: true,
    disableContextMenu: true,
    scene: [MenuScene, GameScene, EndingScene, UIScene]
};

const game = new Phaser.Game(phaserConfig);

game.canvas.style.cursor = 'none';
game.canvas.addEventListener('mousedown', () => {
    game.scale.startFullscreen();
});
game.canvas.addEventListener('mousedown', () => {
    game.input.mouse.requestPointerLock();
});
