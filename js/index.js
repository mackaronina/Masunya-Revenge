import GameScene from './GameScene.js'
import MenuScene from "./MenuScene.js";

const ratio = Math.max(window.screen.width / window.screen.height, window.screen.height / window.screen.width);
const DEFAULT_HEIGHT = 1080;
const DEFAULT_WIDTH = Math.round(ratio * DEFAULT_HEIGHT);

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: "thegame",
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            fps: 300,
            debug: false,
            debugBodyColor: 0x000000
        }
    },
    pixelArt: true,
    disableContextMenu: false,
    scene: [MenuScene, GameScene]
};

const game = new Phaser.Game(config);

game.canvas.style.cursor = 'none';
game.canvas.addEventListener('mousedown', () => {
    game.scale.startFullscreen();
});
game.canvas.addEventListener('mousedown', () => {
    game.input.mouse.requestPointerLock();
});