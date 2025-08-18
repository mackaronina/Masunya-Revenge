import PhysicObject from '../PhysicObject.js';
import config from '../config.js';

export default class MenuPic extends PhysicObject {
    constructor(scene, y, sprite, frame = 0) {
        super(scene, scene.game.config.width / 2, y, sprite, frame);
        this.depth = config.depth.interface;
        this.setOrigin(0.5);
        this.setScrollFactor(0);
    }
}